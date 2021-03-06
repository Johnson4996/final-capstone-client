import React, { useRef } from "react"
import { Link } from "react-router-dom"
import "./Auth.css"

export const Register = (props) => {
    const first_name = useRef()
    const last_name = useRef()
    const username = useRef()
    const email = useRef()
    const bio = useRef()
    const password = useRef()
    const verifyPassword = useRef()
    const passwordDialog = useRef()

    

    const handleRegister = (e) => {
        e.preventDefault()

        if (password.current.value === verifyPassword.current.value) {

            //use ref to create new user object 
            const newUser = {
                "first_name": first_name.current.value,
                "last_name": last_name.current.value,
                "email": email.current.value,
                "username": username.current.value,
                "password": password.current.value,
                "bio": bio.current.value,
                "active": true,
            }
            //POST new user to db and log them in 
            return fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newUser)
            })
                .then(_ => _.json())
                .then(res => {
                    if ("token" in res) {
                        //set local storage items for personalized usage
                        localStorage.setItem("cbuser", res.token)
                        localStorage.setItem("cbuser_id", res.id )
                        props.history.push("/")
                    }
                })
        } else {
            passwordDialog.current.showModal()
        }
    }

    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" ref={passwordDialog}>
                <div>Passwords do not match</div>
                <button className="button--close" onClick={e => passwordDialog.current.close()}>Close</button>
            </dialog>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Register an account</h1>
                <div className="register__fullName">
                    <fieldset>
                        <label htmlFor="first_name">First Name </label>
                        <input ref={first_name} type="text" name="first_name" className="form-control" placeholder="First Name" required autoFocus />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="last_name">Last Name </label>
                        <input ref={last_name} type="text" name="last_name" className="form-control" placeholder="Last Name" required autoFocus />
                    </fieldset>
                </div>
                <fieldset>
                    <label htmlFor="inputUsername"> Username </label>
                    <input ref={username} type="text" name="username" className="form-control" placeholder="Username" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputEmail"> Email address </label>
                    <input ref={email} type="email" name="email" className="form-control" placeholder="Email address" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputBio"> Bio </label>
                    <input ref={bio} type="text" name="bio" className="form-control" placeholder="Enter a quick bio for others to see" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputPassword"> Password </label>
                    <input ref={password} type="password" name="password" className="form-control" placeholder="Password" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="verifyPassword"> Verify Password </label>
                    <input ref={verifyPassword} type="password" name="verifyPassword" className="form-control" placeholder="Verify password" required />
                </fieldset>
                <fieldset style={{
                    textAlign: "center"
                }}>
                    <button className="btn btn-1 btn-sep icon-send" type="submit" >Create Account</button>
                </fieldset>
            </form>
            <section className="link--register">
                Already registered? <Link to="/login">Login</Link>
            </section>
        </main>
    )
}