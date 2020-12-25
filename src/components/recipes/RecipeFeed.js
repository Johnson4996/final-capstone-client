import React, {useContext, useEffect} from "react"
import { Link } from "react-router-dom"
import { RecipeContext } from "./RecipeProvider"






export const RecipeFeed = (props) =>{


    const {getAllRecipes, recipes} = useContext(RecipeContext)

    useEffect(()=> {
        getAllRecipes()
        
    },[])

    


    return(
        <>
        
        
        

            <div className="recipeFeedContainer">
                    {
                       recipes.map(r =>{
                          return(
                    <Link onClick={()=>{props.history.push(`/recipe/${r.id}`)}}>
                        <div key={r.id} className="recipeCard">
                            <p>{r.title}</p>
                            <p>By: <Link onClick={()=>{props.history.push(`/user/${r.author.user.id}`)}}>{r.author.user.username}</Link></p>
                            <img src={r.picture}/>
                        </div>
                    </Link>
                          ) 
                       })
                    }
            </div>

        </>
    )
}