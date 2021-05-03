const x = {
     "53831525":{
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/740e0920-d065-4922-8900-b0510309d729-profile_image-300x300.png",
      cookbook_ids: ["fox"],
    },
    "116810429":{
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/282fdf7b-4922-4759-855f-210c2b9021c7-profile_image-300x300.png",
      cookbook_ids: ["fox"],
    },
    "80615421":{
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/n0ne-profile_image-f91f360d0a2f32ca-300x300.jpeg",
      cookbook_ids: ["falcon"],
    },
    "26551727":{
        profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/8647bb3a-1e64-4839-987f-6aec0b44a223-profile_image-300x300.png",
        cookbook_ids: ["fox", "falco"],
    }
 }

const axios = require('axios').default

export class TwitchService {
    streams:Object;

    constructor() {
       this.streams = x ;
     }

    async getStreams():Promise<any> {
        const stream_ids = Object.keys(this.streams).join('&user_id=')
        const url = `https://api.twitch.tv/helix/streams?user_id=${stream_ids}`
        let live = []
        try {
            const {data}  = await axios.get(url,
                {
                    headers: {
                    "Authorization": `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
                    "client-id": `${process.env.REACT_APP_CLIENT_ID}`
                }
            })
            live = data.data.map(result => {
                const {title, user_id} = result
                this.streams[user_id].title = title
                if(!this.streams[user_id].cookbook_ids
                    .some(el => el === process.env.REACT_APP_COOKBOOK_ID)) return null
                return {
                    ...result,
                     profile_image_url:this.streams[user_id].profile_image_url
                    }
            })
        }catch(err) {
            console.log(err);
        }
        return live
    }
}