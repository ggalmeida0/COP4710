import axios from "axios";
import { GRAPHQL_SERVER } from '../env';


const addToCart = (username,gameTitle) => {
    const query = `
        mutation {
            addToCart(username: "${username}", gameTitle: "${gameTitle}") {
                message
                success
            }
        }`;
    axios.post(GRAPHQL_SERVER,{query:query}).catch(error => console.error(error));
}

const removeFromCart = (username,gameTitle) => {
    const query = `
        mutation{
          removeFromCart(username: "${username}", gameTitle: "${gameTitle}") {
                message
                success
            }
        }`;
    axios.post(GRAPHQL_SERVER,{query:query}).catch(error => console.error(error));
}


export const cartServices = {
    addToCart:addToCart,
    removeFromCart:removeFromCart
}

