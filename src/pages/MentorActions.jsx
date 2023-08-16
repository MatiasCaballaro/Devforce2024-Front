import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import {
  BsChevronUp,
  BsChevronDown,
  BsMicrosoftTeams,
  BsSearch,
} from "react-icons/bs";

import { sortTable } from "../helpers/sortTable";
import { findSearch } from "../helpers/search";

export const MentorActions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [foundTrainings, setFoundTrainings] = useState();
  const [trainings, setTrainings] = useState([]);

  const {
    userData,
    user,
    testCredentianls,
    loadingContent,
    setLoadingContent,
    setAlert,
  } = useContext(UserContext);

  const getTrainings = async () => {
    setLoadingContent(true);
    await axios
      .get(`http://localhost:8080/api/v1/trainings`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        let arr = resp.data.contenido;
        arr.forEach((training) => {
          delete training.area;
          training.status = training.status.replace("_", " ");
          training.creationDate = training.creationDate.slice(0, -16);
          training.creationDate = `${training.creationDate.substring(
            8,
            10
          )}-${training.creationDate.substring(
            5,
            7
          )}-${training.creationDate.substring(0, 4)}`;

          delete training.mentorId;
        });
        console.log(
          arr.filter((training) => {
            if (training.mentorId) {
              if (training.mentorId.id === userData.id) {
                return true;
              }
            } else {
              return true;
            }
          })
        );
        setTrainings(
          arr.filter((training) => {
            if (training.mentorId) {
              if (training.mentorId.id === userData.id) {
                return true;
              }
            } else {
              return true;
            }
          })
        );
        setLoadingContent(false);
      })
      .catch((err) => {
        console.log(err);
        testCredentianls();
        setLoadingContent(false);
      });
  };

  useEffect(() => {
    getTrainings();
  }, []);

  useEffect(() => {
    setFoundTrainings(findSearch(trainings, search));
  }, [search]);

  return (
    <div className="mt-10 mb-20">
      <div className="w-[90%] mx-auto">
        <div className="rounded-lg overflow-hidden border">
          <div className="w-full text-gray-700 uppercase bg-gray-100 p-2 flex justify-between border-b items-center text-sm">
            <div className="flex gap-4">
              <button className="border border-neutral-500 rounded-md p-2">
                next page
              </button>
              <button className="border border-neutral-500 rounded-md p-2">
                previus page
              </button>
            </div>
            <label className="relative text-gray-400 focus-within:text-gray-600 block h-fit">
              <BsSearch
                className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 text-neutral-500"
                size={16}
              />
              <input
                type="text"
                name="search-training"
                className="form-input w-full bg-white border border-neutral-500 rounded-md p-1 ps-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </label>
          </div>
          <table
            className="w-full text-sm text-left text-gray-500"
            id="user-trainings-table"
          >
            <thead className="text-sm text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col">
                  <div>Usuario</div>
                </th>
                <th scope="col">
                  <div className="flex gap-2 items-center">
                    Estado
                    <div className="flex flex-col">
                      <button
                        className="hover:text-gray-400 order-table"
                        onClick={(e) => sortTable(1, "asc", e.target)}
                      >
                        <BsChevronUp size={12} />
                      </button>
                      <button
                        className="hover:text-gray-400 order-table"
                        onClick={(e) => sortTable(1, "desc", e.target)}
                      >
                        <BsChevronDown size={12} />
                      </button>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div>Descripción</div>
                </th>
                <th scope="col">
                  <div>Link</div>
                </th>
                <th scope="col">
                  <div className="flex gap-2 items-center">
                    Creada el
                    <div className="flex flex-col">
                      <button
                        className="hover:text-gray-400 order-table"
                        onClick={(e) => sortTable(4, "asc", e.target)}
                      >
                        <BsChevronUp size={12} />
                      </button>
                      <button
                        className="hover:text-gray-400 order-table"
                        onClick={(e) => sortTable(4, "desc", e.target)}
                      >
                        <BsChevronDown size={12} />
                      </button>
                    </div>
                  </div>
                </th>
                <th className="actions" scope="col">
                  -
                </th>
              </tr>
            </thead>
            <tbody>
              {trainings.length > 0 ? (
                //TODO: Copiar lo de trainings map a found trainings map
                foundTrainings ? (
                  foundTrainings.map((soli) => (
                    <>
                      <tr key={soli.id} className={`bg-white border-b`}>
                        <td scope="col">
                          <span>
                            {soli.userId.firstname + " " + soli.userId.lastname}
                          </span>
                        </td>
                        <td scope="col">
                          <span>{soli.status}</span>
                        </td>
                        <td scope="col">
                          <span>{soli.title}</span>
                        </td>
                        <td scope="col">
                          {soli.link ? (
                            <a className="underline" href={soli.link}>
                              {soli.link}
                            </a>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td scope="col">
                          <span>{soli.creationDate}</span>
                        </td>
                        <td className="actions" scope="col">
                          <button
                            className="button-outline"
                            onClick={() => {
                              navigate(`/training/${soli.id}`);
                            }}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  trainings.map((soli) => (
                    <>
                      <tr key={soli.id} className={`bg-white border-b`}>
                        <td scope="col">
                          <span>
                            {soli.userId.firstname + " " + soli.userId.lastname}
                          </span>
                        </td>
                        <td scope="col">
                          <span>{soli.status}</span>
                        </td>
                        <td scope="col">
                          <span>{soli.title}</span>
                        </td>
                        <td scope="col">
                          {soli.link ? (
                            <a className="underline" href={soli.link}>
                              {soli.link}
                            </a>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td scope="col">
                          <span>{soli.creationDate}</span>
                        </td>
                        <td className="actions" scope="col">
                          <button
                            className="button-outline"
                            onClick={() => {
                              navigate(`/training/${soli.id}`);
                            }}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    </>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-start gap-4 items-center">
                      <h1 className="text-lg">
                        Parece que no hay solcitudes...
                      </h1>
                      <Link
                        to={"/create-training"}
                        className="m-2 text-lg button-outline"
                      >
                        Creá una acá
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
