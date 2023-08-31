import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiErrorCircle, BiCheckCircle } from "react-icons/bi";

export const toggleModal = () => {
  document.querySelector("#confirmar-modal").classList.toggle("hidden");
  document.querySelector(".backdrop").classList.toggle("hidden");
};

export const ConfirmarModal = ({
  titulo,
  hasLink = true,
  state,
  training,
  func,
}) => {
  const [comment, setComment] = useState("");
  const [link, setLink] = useState("");

  return (
    <>
      <div className="backdrop hidden"></div>
      <div
        id="confirmar-modal"
        tabIndex="-1"
        className="modal hidden fixed z-50 px-4 py-2 overflow-x-hidden overflow-y-auto max-h-full"
      >
        <div className="relative min-w-[500px] max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-10">
            <div className="header flex justify-center gap-2 items-center mb-2 relative">
              {state === "error" ? (
                <BiErrorCircle size={40} color="#CC2C2C" />
              ) : (
                <BiCheckCircle size={40} color="#057D4B" />
              )}
              <h1 className="text-2xl text-neutral-900 font-bold">
                {titulo}: training.titulo
              </h1>
            </div>
            <div className="info text-center">
              <p className="text-lg underline mt-2">Último comentario:</p>
              <p className="ps-4">
                {training.comments && training.comments[0].message}
              </p>
            </div>
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                func(training.id, {
                  days: 0,
                  link: link,
                  comment: comment,
                  status: state === "error" ? "REJECTED" : "PENDING_USER",
                });
              }}
              className="mt-4"
            >
              <label className="flex flex-col">
                Respuesta:
                <input
                  required
                  type="text"
                  name="comment"
                  value={comment}
                  onChange={(ev) => setComment(ev.target.value)}
                />
              </label>
              {hasLink && (
                <label className="flex flex-col">
                  Link:
                  <input
                    type="text"
                    name="link"
                    value={link}
                    onChange={(ev) => setLink(ev.target.value)}
                  />
                </label>
              )}
              <div className="flex gap-4 justify-around mt-4">
                <button
                  onClick={() => toggleModal()}
                  className="button-outline border-[#CC2C2C]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button-outline border-[#057D4B]"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
