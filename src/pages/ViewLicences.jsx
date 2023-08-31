import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  BsChevronUp,
  BsChevronDown,
  BsMicrosoftTeams,
  BsSearch,
} from "react-icons/bs";
import { sortTable } from "../helpers/sortTable";
import { findSearch } from "../helpers/search";
import { Link } from "react-router-dom";

export const ViewLicences = () => {
  const {
    userData,
    user,
    testCredentianls,
    loadingContent,
    setLoadingContent,
  } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const getLicencedUsers = async () => {
    setLoadingContent(true);
    await axios
      .get(`http://localhost:8080/api/v1/trainings`, {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
      .then((resp) => {
        let respTrainings = resp.data.contenido;
        let licencedUsers = [];

        respTrainings.forEach((training) => {
          if (training.status === "APPROVED") {
            let index = licencedUsers.findIndex(
              (user) => user.id === training.userId.id
            );
            console.log(index);
            if (index !== -1) {
              licencedUsers[index].approbedTrainings =
                licencedUsers[index].approbedTrainings + 1;
            } else {
              training.userId = { ...training.userId, approbedTrainings: 1 };
              licencedUsers.push(training.userId);
            }
          }
        });
        console.log(licencedUsers);
        setUsers(licencedUsers);
      })
      .catch((err) => console.error(err))
      .finally(setLoadingContent(false));
  };

  useEffect(() => {
    getLicencedUsers();
  }, []);

  if (!loadingContent && users)
    return (
      <>
        <h1 className="title ms-10 text-secondary mb-8">
          Usuarios con licencias
        </h1>
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
              className="licences-table w-full text-sm text-left text-gray-500"
              id="user-trainings-table"
            >
              <thead className="text-sm text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col">
                    <div className="flex gap-2 items-center">
                      Usuario
                      <div className="flex flex-col">
                        <button
                          className="hover:text-gray-400 order-table"
                          onClick={(e) => sortTable(0, "asc", e.target)}
                        >
                          <BsChevronUp size={12} />
                        </button>
                        <button
                          className="hover:text-gray-400 order-table"
                          onClick={(e) => sortTable(0, "desc", e.target)}
                        >
                          <BsChevronDown size={12} />
                        </button>
                      </div>
                    </div>
                  </th>
                  <th scope="col">
                    <span>Mail</span>
                  </th>
                  <th scope="col">
                    <div className="flex gap-2 items-center">
                      Trainings en curso
                      <div className="flex flex-col">
                        <button
                          className="hover:text-gray-400 order-table"
                          onClick={(e) => sortTable(2, "asc", e.target)}
                        >
                          <BsChevronUp size={12} />
                        </button>
                        <button
                          className="hover:text-gray-400 order-table"
                          onClick={(e) => sortTable(2, "desc", e.target)}
                        >
                          <BsChevronDown size={12} />
                        </button>
                      </div>
                    </div>
                  </th>
                  <th scope="col">
                    <span>-</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className={`bg-white border-b`}>
                      <td scope="col">
                        <span>{user.firstname + " " + user.lastname}</span>
                      </td>
                      <td scope="col">
                        <div className="flex gap-2">
                          {user.hasTeams && (
                            <a
                              href={`https://teams.microsoft.com/l/chat/0/0?users=${user.email}`}
                            >
                              <BsMicrosoftTeams
                                size={22}
                                color="#333"
                              ></BsMicrosoftTeams>
                            </a>
                          )}
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td scope="col">
                        <span className="ps-2">{user.approbedTrainings}</span>
                      </td>
                      <td scope="col">
                        <Link
                          to={`/profile/${user.id}`}
                          className="button-secondary"
                        >
                          Ver más
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex justify-start gap-4 items-center">
                        <h1 className="text-lg ms-6">
                          Aún no hay usuarios con licencias...
                        </h1>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <img
          className="absolute bottom-0 right-0 z-[-1] w-full"
          src="/src/assets/icons/bg-misc-profile.svg"
          alt=""
        />
      </>
    );
};
