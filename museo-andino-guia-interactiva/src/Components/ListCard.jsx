import React from "react";
import { Card } from "./Card";
import {
  FileDoneOutlined,
  ReadOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
export const ListCard = ({ setTabIndex }) => {
  return (
    <div className="list_card">
      {/* recetas */}
      {/* videos/informes */}
      {/* para ejercicio */}

      <Card
        onClick={() => setTabIndex(2)}
        mje={` `}
        logo={<FileDoneOutlined style={{ fontSize: "80px" }} />}
      />
      <Card
        onClick={() => setTabIndex(3)}
        mje={` `}
        logo={<ReadOutlined style={{ fontSize: "80px" }} />}
      />
      <Card
        onClick={() => setTabIndex(4)}
        mje={``}
        logo={<ScheduleOutlined style={{ fontSize: "80px" }} />}
      />
      <Card
        onClick={() => setTabIndex(11)}
        mje={` `}
        logo={<ReadOutlined style={{ fontSize: "80px" }} />}
      />
    </div>
  );
};
