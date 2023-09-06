
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import bgMisc from "../assets/icons/bg-misc-create-training.svg";

export const CreateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [teams, setTeams] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const navigate = useNavigate();

  const { user, testCredentianls } = useContext(UserContext);

  const submitUser = async () => {
    console.log({
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      role,
      area,
      phone: phone,
      hasTeams: teams,
    });
    await axios
      .post(
        "http://localhost:8080/api/v1/users",
        {
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: password,
          role: role,
          area: role === "MENTOR" ? area : null,
          phone: phone,
          hasTeams: teams,
        },
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        console.error(err);
        testCredentianls();
      });
    // .finally(navigate("/users"));
  };

  return (
    <>
      <div
        className="w-full flex items-center justify-center mt-10"
        id="crear-usuario"
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            submitUser();
          }}
          className="w-[700px] border flex flex-col px-20 rounded-[15px] shadow bg-white mb-10"
        >
          <h1 className="title text-secondary mb-6 text-[28px]">
            Crear usuario
          </h1>
          <div className="flex flex-col gap-8">
            <label>
              <span>
                Nombre: <strong className="text-red-400">*</strong>
              </span>
              <input
                type="text"
                name="firstName"
                placeholder="Escribí el nombre"
                value={firstName}
                onChange={(ev) => setFirstName(ev.target.value)}
                required
              />
            </label>

            <label>
              <span>
                Apellido: <strong className="text-red-400">*</strong>
              </span>
              <input
                type="text"
                name="lastname"
                placeholder="Escribí el apellido"
                value={lastName}
                onChange={(ev) => setLastName(ev.target.value)}
                required
              />
            </label>

            <label>
              <span>
                Mail: <strong className="text-red-400">*</strong>
              </span>
              <input
                type="text"
                name="mail"
                placeholder="Escribí el mail"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
            </label>

            <label>
              <span>Teléfono: </span>
              <input
                type="text"
                name="phone"
                placeholder="Escribí el teléfono"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </label>

            <label>
              <span>
                Contraseña: <strong className="text-red-400">*</strong>
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Cambio de tipo de entrada
                  name="password"
                  style={{ width: '81%' }}
                  placeholder="Escribí la contraseña"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                />
                <button
                  type="button"
                  className="right-2 top-2 button-primary"
                  style={{ float: 'right', width: '19%'}}
                  onClick={() => setShowPassword(!showPassword)} // Alternar la visibilidad de la contraseña
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>

            <label className={`${role === "MENTOR" ? "" : "mb-6 "}`}>
              <span>
                Rol: <strong className="text-red-400">*</strong>
              </span>
              <select
                name="role"
                value={role}
                onChange={(ev) => {
                  setRole(ev.target.value);
                  ev.target.value !== "MENTOR" ? setArea("") : null;
                }}
                required
              >
                <option value="" hidden>
                  Seleccione una opcion
                </option>
                <option value="ADMIN">Administrador</option>
                <option value="MENTOR">Mentor</option>
                <option value="USER">Usuario</option>
              </select>
            </label>

            <label
              className={`${role === "MENTOR" ? "mb-6 " : "!hidden "}mt-0`}
            >
              <span>
                Área: <strong className="text-red-400">*</strong>
              </span>
              <select
                name="area"
                value={area}
                disabled={role !== "MENTOR"}
                onChange={(ev) => setArea(ev.target.value)}
                required
              >
                <option value="" hidden>
                  Seleccione una opcion
                </option>
                <option value="BACKEND">Back-End</option>
                <option value="FRONTEND">Front-End</option>
                <option value="DATA">Datos</option>
                <option value="DEVOPS">DevOps</option>
                <option value="SALESFORCE">Salesforce</option>
              </select>
            </label>
          </div>
          <label className="!flex-row items-center gap-5">
            <span>Tiene Teams?</span>
            <input
              className="!mb-0"
              type="checkbox"
              name="hasTeams"
              value={teams}
              onChange={(ev) => setTeams(!teams)}
            />
          </label>
          <button type="submit" className="button-primary mb-16 mt-4">
            Crear usuario
          </button>
        </form>
      </div>
      <img
        className="absolute bottom-0 right-0 z-[-1] w-full"
        src={bgMisc}
        alt=""
      />
    </>
  );
};