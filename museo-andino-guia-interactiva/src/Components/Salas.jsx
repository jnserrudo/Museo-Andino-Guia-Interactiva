import React from "react";

export const Salas = () => {
  return (
    <div>
      <main className="main_home">
        <img
          src={`${import.meta.env.BASE_URL}sala1_1.JPG`}
          className="img_fondo"
          alt=""
        />

        {/* <ListCard
                    setTabIndex={(index) => setSelectedKey(index.toString())}
                  /> */}
      </main>
    </div>
  );
};
