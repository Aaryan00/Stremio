import React, { useEffect } from "react";
import { auth } from "../_actions/user_actions";
import { useSelector, useDispatch } from "react-redux";

export default function (ComposedClass, reload, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
      const w_auth = localStorage.getItem("w_auth");
      const token = {
        w_auth: w_auth,
      };
      dispatch(auth(token)).then(async (response) => {
        // console.log(response);
        if (await !response.payload.isAuth) {
          if (reload) {
            props.history.push("/register");
          }
        } else {
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (reload === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, [dispatch, props.history, user.googleAuth]);

    return <ComposedClass {...props} user={user} />;
  }
  return AuthenticationCheck;
}
