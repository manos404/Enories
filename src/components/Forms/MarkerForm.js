import React from "react";
import { Card, Form, Input, Button, Select } from "antd";

const MarkerForm = (props) => {
  const [form] = Form.useForm();

  const { Option } = Select;

  let options = [];

  props.data.features.map((feature) => {
    if (feature.geometry.type === "Polygon") {
      options.push(feature.properties.name);
    }
  });

  const createNewMarker = async (values) => {
    const { name, parish, coordinates } = values;

    const [latitude, longitude] = coordinates.split(",").map(parseFloat);

    if (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      props.setRender(null);
      props.setFly([latitude, longitude]);
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/marker`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              parish: parish,
              coordinates: [latitude, longitude],
            }),
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(response.message);
        }
        console.log(responseData);
        props.setOpen(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new Error("Οι συντεταγμένες δεν είναι έγκυρες.");
    }
  };

  const editMarker = async (values) => {
    props.setOpen(false);
    const { name, parish, coordinates } = values;
    // console.log(coordinates);
    const [latitude, longitude] = coordinates.split(",").map(parseFloat);
    // console.log(latitude, longitude);
    props.setRender(null);
    if (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      props.setFly([latitude, longitude]);
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/marker/${props.feature.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              parish: parish,
              coordinates: [latitude, longitude],
            }),
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(response.message);
        }
        console.log(responseData);
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new Error("Οι συντεταγμένες δεν είναι έγκυρες.");
    }
  };

  return (
    <>
      <Form
        form={form}
        onFinish={props.type === "newMarker" ? createNewMarker : editMarker}
        initialValues={{
          name: props.feature ? props.feature.properties.name : "",
          coordinates: props.feature
            ? [
                props.feature.geometry.coordinates[0],
                props.feature.geometry.coordinates[1],
              ]
            : "",

          parish: props.feature ? props.feature.properties.parish : "",
        }}
      >
        <Card
          title={<h3 style={{ textAlign: "left" }}> ΕΠΙΣΗΜΟ ΟΝΟΜΑ ΝΑΟΥ </h3>}
          size="small"
          style={{
            width: "100%",
            marginTop: 10,
          }}
          hoverable
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Το όνομα είναι υποχρεωτικό",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Card>

        <Card
          title={<h3 style={{ textAlign: "left" }}> ΕΝΟΡΙΑ </h3>}
          size="small"
          style={{
            width: "100%",
            marginTop: 10,
          }}
          hoverable
        >
          <Form.Item
            name="parish"
            rules={[
              {
                required: true,
                message: "Η ενορια είναι υποχρεωτικη",
              },
            ]}
          >
            <Select
              style={{
                width: "100%",
              }}
            >
              {options.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        <Card
          type="inner"
          title={
            <h3 style={{ textAlign: "left" }}>
              ΣΥΝΤΕΤΑΓΜΕΝΕΣ (latitude,longitude)
            </h3>
          }
          style={{
            width: "100%",
            marginTop: 10,
          }}
        >
          <Form.Item
            name="coordinates"
            rules={[
              {
                required: true,
                message: "Οι συντεταγμενες είναι υποχρεωτικες",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: "45%",
              marginTop: "20px",
            }}
          >
            {props.type === "newMarker" ? "Create" : "Edit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MarkerForm;
