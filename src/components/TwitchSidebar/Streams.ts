/* Types */

const streams = {
    "53831525": {
      _id: "53831525",
      login_name: "leffen",
      display_name: "Leffen",
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/740e0920-d065-4922-8900-b0510309d729-profile_image-300x300.png",
      character: "fox",
      cookbook_ids: ["fox"],
      title: ''
    },
    "116810429":{
      _id: "116810429",
      login_name: "ibdw",
      display_name: "iBDW",
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/282fdf7b-4922-4759-855f-210c2b9021c7-profile_image-300x300.png",
      character: "fox",
      cookbook_ids: ["fox"],
      title: ''
    },
    "80615421":{
      _id: "80615421",
      login_name: "n0ne",
      display_name: "n0ne",
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/n0ne-profile_image-f91f360d0a2f32ca-300x300.jpeg",
      character: "falcon",
      cookbook_ids: ["falcon"],
      title: ''
    }
 }

export async function liveStreams() {
    const url = `https://api.twitch.tv/helix/streams?game_id=${process.env.REACT_APP_GAME_ID}`
    return await fetch(url,
        {
            headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
            "client-id": `${process.env.REACT_APP_CLIENT_ID}`
        }
    })
    .then(res => res.json())
    .then(json => {
        const live = json.data.map(result => {
            let user_id = result.user_id
            if(user_id in streams) {
                streams[user_id].title = result.title
                if(!streams[user_id].cookbook_ids
                    .some(el => el === process.env.REACT_APP_COOKBOOK_ID)) return null
                return streams[user_id]
            } 
            else return null
        })
        return live
    })
    .catch(err => console.log(err))
}