import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { MicrosoftTeamsLogo } from "@phosphor-icons/react";

export const Training = () => {
  let { trainingId } = useParams();
  const {
    userData,
    user,
    testCredentianls,
    loadingContent,
    setLoadingContent,
  } = useContext(UserContext);
  const [training, setTraining] = useState();
  const [link, setLink] = useState();
  const [comment, setComment] = useState();
  const [days, setDays] = useState(30);

  const getTraining = async () => {
    setLoadingContent(true);
    //TODO: Ver en que queda esta vista
    await axios
      .get(`http://localhost:8080/api/v1/trainings/${trainingId}`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        let ex = resp.data.contenido;

        ex.creationDate = ex.creationDate.slice(0, -16);
        ex.creationDate = `${ex.creationDate.substring(
          8,
          10
        )}-${ex.creationDate.substring(5, 7)}-${ex.creationDate.substring(
          0,
          4
        )}`;
        if (ex.endDate) {
          ex.endDate = ex.endDate.slice(0, -16);
          ex.endDate = `${ex.endDate.substring(8, 10)}-${ex.endDate.substring(
            5,
            7
          )}-${ex.endDate.substring(0, 4)}`;
        }

        if (ex.approvedDate) {
          ex.approvedDate = ex.approvedDate.slice(0, -16);
          ex.approvedDate = `${ex.approvedDate.substring(
            8,
            10
          )}-${ex.approvedDate.substring(5, 7)}-${ex.approvedDate.substring(
            0,
            4
          )}`;
        }

        ex.status = ex.status.replace("_", " ").toLowerCase();

        ex.comments.forEach((comment) => {
          comment.created_at = comment.created_at.slice(0, -16);
          comment.created_at = `${comment.created_at.substring(
            8,
            10
          )}-${comment.created_at.substring(
            5,
            7
          )}-${comment.created_at.substring(0, 4)}`;
        });
        console.log(ex);
        setTraining(ex);
      })
      .catch((err) => {
        console.log(err);
        testCredentianls();
      });
    setLoadingContent(false);
  };

  const modifyTraining = async (id, action) => {
    let body;
    if (userData.role.toLowerCase() == "user") {
      action == "accept"
        ? (body = { status: "PENDING_ADMIN" })
        : (body = { status: "REJECTED" });
    }

    if (userData.role.toLowerCase() == "mentor") {
      action == "accept"
        ? (body = { status: "PENDING_USER", comment, link, days })
        : (body = { status: "REJECTED", comment });
    }

    if (userData.role.toLowerCase() == "admin") {
      action == "accept"
        ? (body = { status: "APPROVED" })
        : (body = { status: "REJECTED" });
    }
    console.log(
      `http://localhost:8080/api/v1/trainings/${id}/${userData.role.toLowerCase()}`,
      body,
      "Bearer " + user.access_token
    );
    axios
      .put(
        `http://localhost:8080/api/v1/trainings/${id}/${userData.role.toLowerCase()}`,
        body,
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        getTraining();
      })
      .catch((err) => {
        console.log(err);
        testCredentianls();
      });
  };

  useEffect(() => {
    getTraining();
  }, []);

  if (training && !loadingContent)
    return (
      <>
        <div className="mx-10">
          <h1 className="title text-secondary my-8 text-[28px]">
            {training.title}
          </h1>
          <div className="flex">
            <div className="info flex-1">
              <div className="text-dfText text-[15px] leading-6">
                <p>
                  <b>Training del área:</b> {training.area.toLowerCase()}
                </p>
                <p>
                  <b>Creada por: </b>
                  {training.userId.firstname + " " + training.userId.lastname}
                </p>
                <p>
                  <b>Estado actual: </b>
                  <span className="capitalize">{training.status}</span>
                </p>
                <p>
                  <b>Creada el: </b>
                  {training.creationDate}
                </p>
                <div className="flex gap-1">
                  <b>Mentor: </b>
                  {training.mentorId ? (
                    <div className="flex gap-1">
                      {training.mentorId.hasTeams && (
                        <a
                          href={`https://teams.microsoft.com/l/chat/0/0?users=${training.mentorId.email}`}
                        >
                          <MicrosoftTeamsLogo
                            size={22}
                            color="#333"
                          ></MicrosoftTeamsLogo>
                        </a>
                      )}
                      <span>
                        {training.mentorId.firstname + ' ' +
                          training.mentorId.lastname}
                      </span>
                    </div>
                  ) : (
                    <span>Aún no hay mentor asignado...</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <b>Administrador: </b>
                  {training.adminId ? (
                    <div className="flex gap-1">
                      {training.adminId.hasTeams && (
                        <a
                          href={`https://teams.microsoft.com/l/chat/0/0?users=${training.adminId.email}`}
                        >
                          <MicrosoftTeamsLogo
                            size={22}
                            color="#333"
                          ></MicrosoftTeamsLogo>
                        </a>
                      )}
                      <span>
                        {training.adminId.firstname + ' ' + training.adminId.lastname}
                      </span>
                    </div>
                  ) : (
                    <span>Aún no hay administrador asignado...</span>
                  )}
                </div>
                <p>
                  <b>Link al curso: </b>
                  {training.link ? (
                    <a className="underline" href={training.link}>
                      {training.link}
                    </a>
                  ) : (
                    "Aún no hay link..."
                  )}
                </p>
              </div>
              <div className="comments max-w-xl ps-10 flex flex-col gap-6 mt-8">
                {training.comments.map((comment) => {
                  return (
                    <div
                      key={comment.id}
                      className="bg-white rounded-[15px] shadow px-[18px] pt-[14px] pb-9 relative flex flex-col text-[15px] font-normal leading-tight"
                    >
                      <span className="capitalize text-primary text-[15px] font-medium leading-tight">
                        {comment.userName}:
                      </span>
                      <span className="pb-5">{comment.message}</span>
                      <span className="absolute bottom-4 left-[18px] text-neutral-400">
                        {comment.created_at}
                      </span>
                    </div>
                  );
                })}
              </div>
              {training.status == `pending ${userData.role.toLowerCase()}` &&
                userData.role !== "MENTOR" && (
                  <div className="mt-8 max-w-xl flex justify-end gap-4 mb-16">
                    <button
                      className="button-secondary"
                      onClick={() => modifyTraining(training.id, "reject")}
                    >
                      RECHAZAR
                    </button>
                    <button
                      className="button-primary"
                      onClick={() => modifyTraining(training.id, "accept")}
                    >
                      APROBAR
                    </button>
                  </div>
                )}
            </div>
            {training.status == `pending ${userData.role.toLowerCase()}` &&
            userData.role === "MENTOR" ? (
              <div className="flex-1">
                <form
                  className="acciones bg-white rounded-[15px] shadow w-fit py-10 px-12 mx-auto"
                  onSubmit={(ev) => ev.preventDefault()}
                >
                  {userData.role == "MENTOR" && (
                    <>
                      <label className="w-[400px] flex flex-col justify-between gap-2">
                        Comentario:
                        <input
                          type="text"
                          name="comment"
                          value={comment}
                          placeholder="Adjunto el link al curso..."
                          required
                          onChange={(ev) => {
                            setComment(ev.target.value);
                          }}
                        />
                      </label>
                      <label className="w-[400px] flex flex-col justify-between gap-2">
                        Link al curso:
                        <input
                          type="text"
                          name="link"
                          value={link}
                          placeholder="https://gire.udemy.com/course/usecases/"
                          required
                          onChange={(ev) => {
                            setLink(ev.target.value);
                          }}
                        />
                      </label>
                      <label className="w-[400px] flex flex-col justify-between gap-2">
                        Dias para realizar el curso:
                        <input
                          type="number"
                          name="days"
                          value={days}
                          placeholder=""
                          onChange={(ev) => {
                            setDays(ev.target.value);
                          }}
                        />
                      </label>
                      <div className="mt-8 flex justify-end gap-4 mb-16">
                        <button
                          className="button-secondary"
                          onClick={() => modifyTraining(training.id, "reject")}
                        >
                          RECHAZAR
                        </button>
                        <button
                          className="button-primary"
                          onClick={() => modifyTraining(training.id, "accept")}
                        >
                          APROBAR
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            ) : null}
          </div>
        </div>
        {userData.role === "MENTOR" ? (
          <img
            className="absolute bottom-0 right-0 z-[-1] w-full"
            src="/src/assets/icons/bg-misc-profile.svg"
            alt=""
          />
        ) : (
          <img
            className="absolute top-0 right-0 z-[-1] h-full"
            src="/src/assets/icons/bg-misc-training.svg"
            alt=""
          />
        )}
      </>
    );
};
