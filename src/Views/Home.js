import React, { useState } from "react";
import {
  Container,
  Input,
  Text,
  Button,
  Grid,
  Table,
  Link,
} from "@nextui-org/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  RadialLinearScale,
  Title,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { PolarArea, Radar } from "react-chartjs-2";
import { Helmet } from "react-helmet-async";
import {
  get_questions_user,
  get_tags_accuracy,
  get_questions_accuracy,
  get_rating_tags_accuracy,
} from "../Api/cf";

ChartJS.register(
  ArcElement,
  Tooltip,
  RadialLinearScale,
  Title,
  PointElement,
  LineElement,
  Filler
);

const Home = () => {
  const columns = [
    { name: "Tag and total submission", uid: "tag" },
    { name: "Accuracy", uid: "accuracy" },
  ];
  const [top, setTop] = useState(false);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);
  const [tagsInfo, setTagsInfo] = useState([]);
  const [ratingInfo, setRatingInfo] = useState([]);
  const [ratingTagsInfo, setRatingTagsInfo] = useState([]);

  const _handleSubmit = async (event) => {
    event.preventDefault();
    setTop(true);

    get_questions_user(username).then((data) => {
      setTagsInfo(get_tags_accuracy(data.result, 10));
      setRatingInfo(get_questions_accuracy(data.result, 10));
      setRatingTagsInfo(get_rating_tags_accuracy(data.result, 5));

      setShow(true);
    });
  };
  return (
    <>
      <Helmet>
        <title>Codeforces Tags Accuracy</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <Container
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $cyan600 -20%, $yellow600 100%",
          }}
          weight="bold"
        >
          Codeforces Tags Accuracy
        </Text>

        <br />
        <form onSubmit={_handleSubmit}>
          <Input
            clearable
            size="xl"
            color="secondary"
            width="500px"
            labelPlaceholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </form>
        <br />
        {show === true ? (
          <Container
            style={{
              height: "50vh",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PolarArea
              data={tagsInfo}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Codeforces tag accuracy",
                  },
                },
              }}
            ></PolarArea>
            <Radar
              data={ratingInfo}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Codeforces question accuracy",
                  },
                },
              }}
            />
          </Container>
        ) : null}
        {show === true ? (
          <Container>
            <Text
              h2
              size={50}
              css={{
                textGradient: "45deg, $blue600 -20%, $pink600 50%",
                textAlign: "center",
              }}
              weight="bold"
            >
              Tags Accuracy for Respective Questions
            </Text>
            {ratingInfo != null &&
              ratingTagsInfo.map((data, idx) => {
                return (
                  <Grid
                    key={idx}
                    css={{
                      display: "flex",
                      height: "50vh",
                      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                      marginBottom: "2vh",
                      padding: "1vh 1vw",
                      borderRadius: "2vh",
                    }}
                  >
                    <Container>
                      <PolarArea
                        data={data.ratingObj}
                        options={{
                          responsive: true,
                          plugins: {
                            title: {
                              display: true,
                              text: data.rating,
                            },
                          },
                        }}
                      />
                    </Container>
                    <Container
                      style={{
                        overflowY: "scroll",
                      }}
                    >
                      <Table
                        aria-label="Table with Tags Accuracy"
                        compact
                        sticked
                        shadow={false}
                        css={{
                          minWidth: "100%",
                        }}
                        color="secondary"
                      >
                        <Table.Header columns={columns}>
                          {(column) => (
                            <Table.Column key={column.uid} allowsSorting>
                              {column.name}
                            </Table.Column>
                          )}
                        </Table.Header>
                        <Table.Body>
                          {data.ratingObj.labels.map((label, idx) => {
                            const accuracy =
                              data.ratingObj.datasets[0].data[idx];
                            const threshold =
                              data.ratingObj.datasets[0].thresholdSubmission;
                            const totalSubmission = parseInt(
                              label.split(" : ")[1]
                            );
                            return parseInt(accuracy) <=
                              parseInt(
                                data.ratingObj.datasets[0].data[
                                  Math.floor(data.ratingObj.labels.length / 5)
                                ]
                              ) || totalSubmission <= threshold ? (
                              <Table.Row key={idx}>
                                <Table.Cell>{label}</Table.Cell>
                                <Table.Cell>
                                  <Text
                                    css={{
                                      textGradient:
                                        "45deg, $error -20%, $red600 50%",
                                    }}
                                  >
                                    {accuracy}
                                  </Text>
                                </Table.Cell>
                              </Table.Row>
                            ) : null;
                          })}
                          {data.ratingObj.labels.map((label, idx) => {
                            const accuracy =
                              data.ratingObj.datasets[0].data[idx];
                            const threshold =
                              data.ratingObj.datasets[0].thresholdSubmission;
                            const totalSubmission = parseInt(
                              label.split(" : ")[1]
                            );
                            return parseInt(accuracy) <=
                              parseInt(
                                data.ratingObj.datasets[0].data[
                                  Math.floor(data.ratingObj.labels.length / 5)
                                ]
                              ) || totalSubmission <= threshold ? null : (
                              <Table.Row key={idx}>
                                <Table.Cell>{label}</Table.Cell>
                                <Table.Cell>
                                  <Text
                                    css={{
                                      textGradient:
                                        "45deg, $success -20%, $green600 50%",
                                    }}
                                  >
                                    {accuracy}
                                  </Text>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table>
                    </Container>
                  </Grid>
                );
              })}
          </Container>
        ) : null}
        

        <Text
          h2
          size={20}
          css={{
            textGradient: "45deg, $blue600 -20%, $pink600 50%",
            textAlign: "center",
          }}
          weight="bold"
        >
          &copy; {new Date().getFullYear()} Codeforces Tags Accuracy. All rights
          reserved.
        </Text>
      </Container>
    </>
  );
};

export default Home;
