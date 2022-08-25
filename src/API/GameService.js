import axios, {AxiosResponse} from "axios";

export default class GameService {

    static async createSudoku(diff) {
        try {
            const response = await axios.get('https://sugoku.herokuapp.com/board', {
                params: {
                    difficulty: diff
                }
            });
            return response.data.board
        } catch (e) {
            console.log(e)
        }
    }
}
