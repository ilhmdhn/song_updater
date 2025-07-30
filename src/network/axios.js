const axios = require('axios');
const conser = require('../tools/conser');
const config = require('../tools/config');

const postSong = async (songList) => {
    try {
        const batchSize = 500;
        try {
            const deleteResponse = await axios.delete(`${config.baseUrl}/update_data_song`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    server: 'main',
                    outlet: 'HP000',
                },
            });

            console.log(`Response DELETE SONG` + JSON.stringify(deleteResponse.data));
            if (!deleteResponse.data.state) {
                return;
            }
        } catch (error) {
            conser('del song', error)
        }


        for (let i = 0; i < songList.length; i += batchSize) {
            const batch = songList.slice(i, i + batchSize);
            try {
                const response = await axios.post(`${config.baseUrl}/update_data_song`, batch);
                console.log(`Post Response ${JSON.stringify(response.data)}`);
            } catch (error) {
                conser('post songgg', error);
            }
        }

    } catch (error) {
        conser('postSong', error);
    }
}

module.exports = {
    postSong
}