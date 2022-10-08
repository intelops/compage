import React, {useEffect} from "react";
import {Navigate} from "react-router-dom";
import Styled from "styled-components";
import GitHubIcon from '@mui/icons-material/GitHub';
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchUser} from "../../store/authentication-actions";
import {config} from "../../utils/constants";

export const Login = () => {
    const dispatch = useAppDispatch();
    const authentication = useAppSelector(state => state.authentication);
    const {client_id, redirect_uri} = config;
    const stateString = uuidv4();
    const scope = "user repo workflow";

    useEffect(() => {
        // After requesting GitHub access, GitHub redirects back to your app with a code parameter
        const url = window.location.href;
        const hasCode = url.includes("?code=");
        const hasState = url.includes("&state=")
        // If GitHub API returns the code parameter
        if (hasCode && hasState) {
            const newUrl = url.split("?code=");
            window.history.pushState({}, null, newUrl[0]);
            dispatch(fetchUser(newUrl[1].substring(0, newUrl[1].indexOf("&"))))
        }
    }, [dispatch]);

    if (authentication.user.login) {
        return <Navigate to="/"/>;
    }

    return (
        <Wrapper>
            <section className="container">
                <div>
                    <div className="login-container" style={{
                        cursor: "pointer"
                    }}>
                        <a
                            style={{
                                cursor: "pointer"
                            }}
                            className="login-link"
                            href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${stateString}`}
                        >
                            <GitHubIcon/>
                            <span>
                                Login with GitHub
                            </span>
                        </a>
                    </div>
                </div>
            </section>
        </Wrapper>
    );
}

const Wrapper = Styled.section`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial;
    

    > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      width: 25%;
      height: 45%;

      > h1 {
        font-size: 2rem;
        margin-bottom: 20px;
      }

      > span:nth-child(2) {
        font-size: 1.1rem;
        color: #808080;
        margin-bottom: 70px;
      }

      > span:nth-child(3) {
        margin: 10px 0 20px;
        color: red;
      }

      .login-container {
        background-color: #000;
        width: 70%;
        border-radius: 3px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        > .login-link {
          text-decoration: none;
          color: #fff;
          text-transform: uppercase;
          cursor: default;
          display: flex;
          align-items: center;          
          height: 40px;

          > span:nth-child(2) {
            margin-left: 5px;
          }
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;          
          height: 40px;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
`;
