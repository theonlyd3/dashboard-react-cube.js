import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./Chart.js";
import { Pane, Button, Text, Heading } from "evergreen-ui";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL
});
const numberFormatter = item => numeral(item).format("0,0");
const dateFormatter = item => moment(item).format("MMM YY");

const renderSingleValue = (resultSet, key) => (
  <h1 height={300}>{numberFormatter(resultSet.chartPivot()[0][key])}</h1>
);

class App extends Component {
  render() {
    return (
      <Container fluid>
        <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
          <Pane flex={10} alignItems="center" display="flex">
            <Heading size={900}>
              Cube JS + React and Postgres SQL Dashboard
            </Heading>
          </Pane>
        </Pane>
        <Row>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Users"
              query={{ measures: ["Users.count"] }}
              render={resultSet => renderSingleValue(resultSet, "Users.count")}
            />
            <br />

            <Chart
              cubejsApi={cubejsApi}
              title="Total Suppliers"
              query={{ measures: ["Suppliers.count"] }}
              render={resultSet =>
                renderSingleValue(resultSet, "Suppliers.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Orders"
              query={{ measures: ["Orders.count"] }}
              render={resultSet => renderSingleValue(resultSet, "Orders.count")}
            />
            <br />
            <Chart
              cubejsApi={cubejsApi}
              title="Total Product Categories"
              query={{ measures: ["ProductCategories.count"] }}
              render={resultSet =>
                renderSingleValue(resultSet, "ProductCategories.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Shipped Orders"
              query={{
                measures: ["Orders.count"],
                filters: [
                  {
                    dimension: "Orders.status",
                    operator: "equals",
                    values: ["shipped"]
                  }
                ]
              }}
              render={resultSet => renderSingleValue(resultSet, "Orders.count")}
            />
            <br />
            <Chart
              cubejsApi={cubejsApi}
              title="Total Line Items"
              query={{ measures: ["LineItems.count"] }}
              render={resultSet =>
                renderSingleValue(resultSet, "LineItems.count")
              }
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="New Users Over Time"
              query={{
                measures: ["Users.count"],
                timeDimensions: [
                  {
                    dimension: "Users.createdAt",
                    dateRange: ["2017-01-01", "2018-12-31"],
                    granularity: "month"
                  }
                ]
              }}
              render={resultSet => (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultSet.chartPivot()}>
                    <XAxis dataKey="category" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={numberFormatter} />
                    <Tooltip labelFormatter={dateFormatter} />
                    <Area
                      type="monotone"
                      dataKey="Users.count"
                      name="Users"
                      stroke="rgb(106, 110, 229)"
                      fill="rgba(106, 110, 229, .16)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            />
            <br />
            <Chart
              cubejsApi={cubejsApi}
              title="New Orders Over Time"
              query={{
                measures: ["Orders.count"],
                timeDimensions: [
                  {
                    dimension: "Orders.createdAt",
                    dateRange: ["2017-01-01", "2018-12-31"],
                    granularity: "month"
                  }
                ]
              }}
              render={resultSet => (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultSet.chartPivot()}>
                    <XAxis dataKey="category" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={numberFormatter} />
                    <Tooltip labelFormatter={dateFormatter} />
                    <Area
                      type="monotone"
                      dataKey="Orders.count"
                      name="Orders"
                      stroke="rgb(255,69,0)"
                      fill="rgb(255,69, .16)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            />
          </Col>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="Orders by Status Over Time"
              query={{
                measures: ["Orders.count"],
                dimensions: ["Orders.status"],
                timeDimensions: [
                  {
                    dimension: "Orders.createdAt",
                    dateRange: ["2017-01-01", "2018-12-31"],
                    granularity: "month"
                  }
                ]
              }}
              render={resultSet => {
                return (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resultSet.chartPivot()}>
                      <XAxis tickFormatter={dateFormatter} dataKey="x" />
                      <YAxis tickFormatter={numberFormatter} />
                      <Bar
                        stackId="a"
                        dataKey="shipped, Orders.count"
                        name="Shipped"
                        fill="#7DB3FF"
                      />
                      <Bar
                        stackId="a"
                        dataKey="processing, Orders.count"
                        name="Processing"
                        fill="#49457B"
                      />
                      <Bar
                        stackId="a"
                        dataKey="completed, Orders.count"
                        name="Completed"
                        fill="#FF7C78"
                      />
                      <Legend />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                );
              }}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
