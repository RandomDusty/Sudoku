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

    static async getSolution(data) {
        try {
            const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

            const encodeParams = (params) =>
                Object.keys(params)
                    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
                    .join('&');

            let response = await fetch('https://sugoku.herokuapp.com/solve', {
                method: 'POST',
                body: encodeParams(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(response => response.json())
                .then(response => response.solution)
                .catch(console.warn)
                
            return response;
        } catch (e) {
            console.log(e)
        }
    }

}
