import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import {
  BsChevronUp,
  BsChevronDown,
  BsMicrosoftTeams,
  BsSearch,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { sortTable } from "../helpers/sortTable";
import { findSearch } from "../helpers/search";

export const AdminTrainings = () => {
  const {
    userData,
    user,
    testCredentianls,
    loadingContent,
    setLoadingContent,
  } = useContext(UserContext);

  const [trainings, setTrainings] = useState([]);
  const [search, setSearch] = useState("");
  const [foundTrainings, setFoundTrainings] = useState();

  const navigate = useNavigate();

  const getTrainings = async () => {
    setLoadingContent(true);
    await axios
      .get(`http://localhost:8080/api/v1/trainings`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        let asd = resp.data.contenido;
        asd.forEach((training) => {
          training.status = training.status.replace("_", " ");
          training.creationDate = training.creationDate.slice(0, -16);
          training.creationDate = `${training.creationDate.substring(
            8,
            10
          )}-${training.creationDate.substring(
            5,
            7
          )}-${training.creationDate.substring(0, 4)}`;

          if (training.mentorId) {
            training.mentorId.name = `${training.mentorId.firstname} ${training.mentorId.lastname}`;
            delete training.mentorId.role;
          }
        });

        // localStorage.setItem("trainings", JSON.stringify(asd));
        setTrainings(asd);
        setLoadingContent(false);
        console.log(asd);
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

  if (!loadingContent && trainings)
    return (
      <>
        <h1 className="title ms-10 text-secondary">Todas las trainings</h1>
        <div className="mt-8 mb-20">
          <div className="w-[90%] mx-auto">
            <div className="rounded-lg overflow-hidden border">
              <div className="w-full text-gray-700 uppercase bg-gray-100 p-2 flex justify-between border-b items-center text-sm">
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
                className="admin-table w-full text-sm text-left text-gray-500"
                id="user-trainings-table"
              >
                <thead className="text-sm text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col">
                      <div>Descripción</div>
                    </th>
                    <th scope="col">
                      <div className="flex gap-2 items-center">
                        Área
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
                      <div>Link</div>
                    </th>
                    <th scope="col">
                      <div className="flex gap-2 items-center">
                        Estado
                        <div className="flex flex-col">
                          <button
                            className="hover:text-gray-400 order-table"
                            onClick={(e) => sortTable(3, "asc", e.target)}
                          >
                            <BsChevronUp size={12} />
                          </button>
                          <button
                            className="hover:text-gray-400 order-table"
                            onClick={(e) => sortTable(3, "desc", e.target)}
                          >
                            <BsChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    </th>
                    <th scope="col">
                      <div>Usuario</div>
                    </th>
                    <th scope="col">
                      <div>Mentor</div>
                    </th>
                    <th scope="col">
                      <div className="flex gap-2 items-center">
                        Creada el
                        <div className="flex flex-col">
                          <button
                            className="hover:text-gray-400 order-table"
                            onClick={(e) => sortTable(6, "asc", e.target)}
                          >
                            <BsChevronUp size={12} />
                          </button>
                          <button
                            className="hover:text-gray-400 order-table"
                            onClick={(e) => sortTable(6, "desc", e.target)}
                          >
                            <BsChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    </th>
                    <th scope="col" className="actions">
                      -
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.length > 0 ? (
                    foundTrainings ? (
                      foundTrainings.map((soli) => (
                        <tr
                          key={soli.id}
                          className={`bg-white${
                            soli.status == "PENDING USER" ? "" : " border-b"
                          }`}
                          onClick={() => {
                            navigate(`/training/${soli.id}`);
                          }}
                        >
                          <td scope="col">
                            <span>{soli.area}</span>
                          </td>
                          <td scope="col">
                            <span>
                              Esperar el cambi del back de tiutulo
                              {/* {soli.userComment} */}
                            </span>
                          </td>
                          <td scope="col">
                            <span>{soli.status}</span>
                          </td>
                          <td scope="col">
                            {soli.mentorId ? (
                              <span className="flex gap-2">
                                <BsMicrosoftTeams
                                  size={22}
                                  color="#333"
                                ></BsMicrosoftTeams>
                                {`${soli.mentorId.firstname}, ${soli.mentorId.lastname}`}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td scope="col">
                            <span>{soli.creationDate}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      trainings.map((soli) => (
                        <>
                          <tr key={soli.id} className={`bg-white border-b`}>
                            <td scope="col">
                              <span>{soli.title}</span>
                            </td>
                            <td scope="col">
                              <span>{soli.area}</span>
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
                              <span>{soli.status}</span>
                            </td>
                            <td scope="col">
                              <span>
                                {soli.userId ? (
                                  <div className="flex gap-1">
                                    {soli.userId.hasTeams && (
                                      <a
                                        href={`https://teams.microsoft.com/l/chat/0/0?users=${soli.userId.email}`}
                                      >
                                        <BsMicrosoftTeams
                                          size={22}
                                          color="#333"
                                        ></BsMicrosoftTeams>
                                      </a>
                                    )}
                                    <span>
                                      {soli.userId.firstname +
                                        soli.userId.lastname}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </span>
                            </td>
                            <td scope="col">
                              <span>
                                {soli.mentorId ? (
                                  <div className="flex gap-1">
                                    {soli.mentorId.hasTeams && (
                                      <a
                                        href={`https://teams.microsoft.com/l/chat/0/0?users=${soli.mentorId.email}`}
                                      >
                                        <BsMicrosoftTeams
                                          size={22}
                                          color="#333"
                                        ></BsMicrosoftTeams>
                                      </a>
                                    )}
                                    <span>
                                      {soli.mentorId.firstname +
                                        soli.mentorId.lastname}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </span>
                            </td>
                            <td scope="col">
                              <span>{soli.creationDate}</span>
                            </td>
                            <td className="actions" scope="col">
                              <button
                                className="button-secondary"
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
                  ) : search ? (
                    <tr>
                      <td>
                        <h1>
                          Parece que no hay solcitudes que coincidan con tu
                          busqueda
                        </h1>
                      </td>
                    </tr>
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
        <img
          className="absolute top-0 right-0 z-[-1] h-full"
          src="/src/assets/icons/bg-misc-table.svg"
          alt=""
        />
      </>
    );
};
