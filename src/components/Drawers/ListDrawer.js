import React, {   useState } from "react";
import {   Card, Drawer, Input, Select } from "antd";
import "antd/dist/reset.css";

import "./ListDrawer.css";


const { Option } = Select;

const ListDrawer = (props) => {
  let options = ["ΟΛΕΣ ΟΙ ΕΝΟΡΙΕΣ"];
  let data = props.data;

  const [search, setSearch] = useState("");

  data.features.map((feature, index) => {
    if (feature.geometry.type === "Polygon") {
      options.push(feature.properties.name);
    }
  });

  const Cards = [];
  let names = [];
  let namesWithNoParishes = [];
 
  function handleClick(feature) {
    props.setFly(feature.geometry.coordinates);
  }

  const onChange = (value) => {
    props.setParishes(value);
   
  };
 

  if (props.parishes === "ΟΛΕΣ ΟΙ ΕΝΟΡΙΕΣ") {
    let check = true;
    
    options.map((polygon) => {
      names = [];

      data.features
        .filter((item) => {
          return search.toLowerCase() === ""
            ? item
            : item.properties.name.toLowerCase().includes(search);
        })
        .map((feature) => {
          if (feature.geometry.type === "Point") {
            if (feature.properties.parish === polygon) {
              names.push(
                <Card
                  key={feature.properties.id}
                  size="small"
                  hoverable
                  onClick={() => handleClick(feature)}
                >
                  {feature.properties.name}
                </Card>
              );
            }
            if (check)
              if (!options.includes(feature.properties.parish)) {
                namesWithNoParishes.push(
                  <Card
                    key={feature.id}
                    size="small"
                    hoverable
                    onClick={() => handleClick(feature)}
                  >
                    {feature.properties.name}
                  </Card>
                );
              }
          }
        });
      if (names.length) {
        Cards.push(
          <Card
            key={polygon}
            title={<h4 style={{ textAlign: "left" }}> {polygon} </h4>}
            size="small"
            style={{
              width: "400px",
              marginTop: 10,
            }}
          >
            {names}
          </Card>
        );
      }
      check = false;
    });
    if (namesWithNoParishes.length) {
      Cards.push(
        <Card
          key={1}
          title={<h4 style={{ textAlign: "left" }}> Χωρίς Ενορία </h4>}
          size="small"
          style={{
            width: "400px",
            marginTop: 10,
          }}
        >
          {namesWithNoParishes}
        </Card>
      );
    }
  } else {
    Cards.push(
      <Card
        title={<h4 style={{ textAlign: "left" }}> {props.parishes} </h4>}
        size="small"
        style={{
          width: "400px",
          marginTop: 10,
        }}
      >
        {names}
      </Card>
    );
    data.features
      .filter((item) => {
        return search.toLowerCase() === ""
          ? item
          : item.properties.name.toLowerCase().includes(search);
      })
      .map((feature) => {
        if (
          feature.geometry.type === "Point" &&
          feature.properties.parish === props.parishes
        ) {
          names.push(
            <Card
              key={feature.properties.id}
              size="small"
              hoverable
              onClick={() => handleClick(feature)}
            >
              {feature.properties.name}
            </Card>
          );
        }
      });
  }

  const onClose = () => {
    props.setOpenList(false);
  };

  return (
    <>
      <Drawer
        open={props.openList}
        title="ΕΝΟΡΙΕΣ"
        placement="right"
        onClose={onClose}
        width="500px"
        height="100vh"
        mask={false}
      >
        <Select
          defaultValue={props.parishes}
          style={{
            width: "400px",
          }}
          onChange={onChange}
        >
          {options.map((name, index) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select> 
        <Input
          style={{
            marginTop: "10px",
            width: "400px",
          }}
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        {Cards}
      </Drawer>
    </>
  );
};

export default ListDrawer;
