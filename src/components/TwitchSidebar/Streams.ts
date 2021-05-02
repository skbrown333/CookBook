const streams = {
     "53831525":{
      _id: "53831525",
      login_name: "leffen",
      display_name: "Leffen",
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/740e0920-d065-4922-8900-b0510309d729-profile_image-300x300.png",
      cookbook_ids: ["fox"],
      title: ''
    },
    "116810429":{
      _id: "116810429",
      login_name: "ibdw",
      display_name: "iBDW",
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/282fdf7b-4922-4759-855f-210c2b9021c7-profile_image-300x300.png",
      cookbook_ids: ["fox"],
      title: ''
    },
    "80615421":{
      _id: "80615421",
      login_name: "n0ne",
      display_name: "n0ne",
      profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/n0ne-profile_image-f91f360d0a2f32ca-300x300.jpeg",
      cookbook_ids: ["falcon"],
      title: ''
    },
    "26551727":{
        _id: "26551727",
        login_name: "mang0",
        display_name: "mang0",
        profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/8647bb3a-1e64-4839-987f-6aec0b44a223-profile_image-300x300.png",
        cookbook_ids: ["fox", "falco"],
        title:""
    }
 }

export async function liveStreams() {
    const stream_ids = Object.keys(streams).join('&user_id=')
    const url = `https://api.twitch.tv/helix/streams?user_id=${stream_ids}`
    let live = []
    try {
        const res  = await fetch(url,
            {
                headers: {
                "Authorization": `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
                "client-id": `${process.env.REACT_APP_CLIENT_ID}`
            }
        }).then(res => res.json())

        live = res.data.map(result => {
            const {title, user_id} = result
            streams[user_id].title = title
            if(!streams[user_id].cookbook_ids
                .some(el => el === process.env.REACT_APP_COOKBOOK_ID)) return null
            return streams[user_id]
        })
    }catch(err) {
        console.log(err);
    }
    return live
}