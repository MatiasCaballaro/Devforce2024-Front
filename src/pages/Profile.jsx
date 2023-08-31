import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import bgMisc from "../assets/icons/bg-misc-profile.svg";
import { ProfileInfo } from "../components/ProfileInfo";

export const Profile = () => {
  const { id } = useParams();
  const {
    userData,
    user,
    testCredentianls,
    loadingContent,
    setLoadingContent,
    setAlert,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const [profileAvatar, setProfileAvatar] = useState();
  const [profileUser, setProfileUser] = useState();
  const [trainings, setTrainings] = useState();
  const [approbedTrainings, setApprobedTrainings] = useState([]);
  const [pendingTrainings, setPendingTrainings] = useState([]);
  const [rejectedTrainings, setRejectedTrainings] = useState([]);

  const deleteUser = async () => {
    setLoadingContent(true);
    console.log("alsjhdkasghd");
    await axios
      .delete(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        setAlert({
          tipo: "error",
          titulo: "Usuario eliminado",
          mensaje: `Eliminaste al usuario ${user.firstname} ${user.lastname}`,
          hidden: false,
        });
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(setLoadingContent(false));
  };

  const getUser = async () => {
    setLoadingContent(true);
    await axios
      .get(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        console.log(resp.data);
        setProfileUser(resp.data.contenido);
        setTrainings(resp.data.contenido.trainings);
        let approbed = [];
        let pending = [];
        let rejected = [];
        resp.data.contenido.trainings.forEach((training) => {
          if (training.status === "APPROVED") {
            approbed.push(training);
            return;
          }
          if (training.status.slice(0, 7) === "PENDING") {
            pending.push(training);
            return;
          }
          if (training.status === "REJECTED") rejected.push(training);
        });
        setApprobedTrainings(approbed);
        setPendingTrainings(pending);
        setRejectedTrainings(rejected);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(setLoadingContent(false));
  };

  const getAvatar = async () => {
    await axios
      .get(`http://localhost:8080/api/v1/users/avatars/Avatar/${id}`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        // console.log(resp);
        if (resp.data.ok) {
          localStorage.setItem("avatar", resp.data.contenido);
          setProfileAvatar(resp.data.contenido);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getUser();
    getAvatar();
    // console.log(userData);
  }, []);

  if (!loadingContent && profileUser)
    return (
      <>
        <div className="top-info w-full flex justify-around items-center">
          <ProfileInfo
            profileUser={profileUser}
            profileAvatar={profileAvatar}
          />
        </div>
        <div>
          {profileUser.role === "USER" && trainings && (
            <>
              <div className="trainings">
                <h1 className="title text-secondary">
                  {profileUser.firstname} tiene {trainings.length} trainings en
                  total
                </h1>
                {approbedTrainings.length > 0 && (
                  <div className="card">
                    <span className="text-xl font-medium">
                      Hay {approbedTrainings.length} aprobadas:{" "}
                    </span>
                    <ul>
                      {approbedTrainings.map((training) => {
                        return (
                          <li>
                            <Link
                              className="text-blue-500 underline me-2 ps-1"
                              to={`/training/${training.id}`}
                            >
                              {training.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {pendingTrainings.length > 0 && (
                  <div className="card">
                    <span className="text-xl font-medium">
                      Hay {pendingTrainings.length} pendientes:{" "}
                    </span>
                    <ul>
                      {pendingTrainings.map((training) => {
                        return (
                          <li>
                            <Link
                              className="text-blue-500 underline me-2 ps-1"
                              to={`/training/${training.id}`}
                            >
                              {training.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {rejectedTrainings.length > 0 && (
                  <div className="card">
                    <span className="text-xl font-medium">
                      Hay {rejectedTrainings.length} rechazadas:{" "}
                    </span>
                    <ul>
                      {rejectedTrainings.map((training) => {
                        return (
                          <li>
                            <Link
                              className="text-blue-500 underline me-2 ps-1"
                              to={`/training/${training.id}`}
                            >
                              {training.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          {userData.role === "ADMIN" && profileUser.id !== userData.id && (
            <button
              className="button-outline ms-8"
              onClick={() => deleteUser()}
            >
              Eliminar usuario
            </button>
          )}
        </div>
        <img
          className="fixed bottom-0 right-0 z-[-1] w-full"
          src={bgMisc}
          alt=""
        />
      </>
    );
};
