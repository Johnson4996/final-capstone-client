import React, { useContext, useEffect, useState } from "react"
import { CategoryContext } from "../categories/CategoryProvider"
import { RecipeContext } from "./RecipeProvider"


export const RecipeForm = (props) =>{
    const {recipe, getSingleRecipe, createRecipe, updateRecipe} = useContext(RecipeContext)
    const {categories,getAllCategories} = useContext(CategoryContext)
    const [recipeState, setRecipeState] = useState({"notes": ""})
    const [ recipeImage, setRecipeImage ] = useState("")

    const editMode = props.match.params.hasOwnProperty("recipe_id")


    const handleControlledInputChange = (event) =>{
        const newRecipe = Object.assign({}, recipeState)
        newRecipe[event.target.name] = event.target.value
        setRecipeState(newRecipe)
    }

    const getRecipeInEditMode = () => {
        if (editMode){
            const recipe_id = parseInt(props.match.params.recipe_id)
            getSingleRecipe(recipe_id)
            .then(setRecipeState(recipe))
            

        }
    }
    
    useEffect(() => {
        getAllCategories()
        .then(getRecipeInEditMode)
        
    },[])

    

    const edit_prompt = (id) => {
        let retVal = window.confirm("Save edits?")
        if(retVal===true){
            constructNewRecipe()
            
            return true
        }else{
            return false
        }
    }


    const constructNewRecipe = () =>{
        const category_id = parseInt(recipeState.category_id)
        
        if(editMode){
            updateRecipe({
                id: recipeState.id,
                title: recipeState.title,
                info: recipeState.info,
                picture: recipeImage.image_url,
                ingredients: recipeState.ingredients,
                directions: recipeState.directions,
                notes: recipeState.notes,
                category: category_id
            }).then(props.history.push(`/recipe/${recipeState.id}`))
        }else{
            createRecipe({
                title: recipeState.title,
                info: recipeState.info,
                picture: recipeImage.image_url,
                ingredients: recipeState.ingredients,
                directions: recipeState.directions,
                notes: recipeState.notes,
                category: category_id
            }).then(props.history.push("/"))
        }
    }

    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
    }

    const createRecipeImageJSON = (event) => {
        getBase64(event.target.files[0], (base64ImageString) => {
            setRecipeImage({'image_url': base64ImageString})
        })
    }

    return(

        <>
        <h2 className="recipeFormTitle">{editMode ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        <form className="recipeForm" autoComplete="off">
            
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title"></label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        placeholder="Title"
                        defaultValue={recipeState.title}
                        onChange={handleControlledInputChange} 
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="info"></label>
                    <textarea name="info" required className="form-control"
                        placeholder="Begining notes about your recipe"
                        defaultValue={recipeState.info}
                        onChange={handleControlledInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                        <div className="uploadButtons">
                            <input type="file" id="image_url" onChange={(evt) => {createRecipeImageJSON(evt)}} />
                            <input type="hidden" name="image_url" value={recipeState.id} />
                        </div>
                    
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="ingredients"></label>
                    <textarea name="ingredients" required  className="form-control"
                        placeholder="Ingredients needed"
                        defaultValue={recipeState.ingredients}
                        onChange={handleControlledInputChange} 
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="directions"></label>
                    <textarea type="text" name="directions" required  className="form-control"
                        placeholder="Directions"
                        defaultValue={recipeState.directions}
                        onChange={handleControlledInputChange} 
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="notes"></label>
                    <input type="text" name="notes" required className="form-control"
                        placeholder="Notes"
                        defaultValue={recipeState.notes}
                        onChange={handleControlledInputChange} 
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="category_id">Category</label>
                    <select name="category_id" className="form-control" 
                    value={recipeState.category_id} onChange={handleControlledInputChange}>
                        <option value="0">Select a category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </fieldset>
            <section>
                <button className="saverecipeButton" type="submit"
                    onClick={evt => {
                        evt.preventDefault() 
                        if(editMode) {
                            edit_prompt(recipeState.id)
                        } else {
                            constructNewRecipe()
                        }
                    }}
                    className="btn btn-primary">
                    Save
                </button>
            </section>
        </form>
        </>
    )
}