/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { FaMusic, FaCalendarAlt } from "react-icons/fa";
import { FaMasksTheater } from "react-icons/fa6";
import * as Styled from "./styles";

export const Songbook = () => {
  const sheetId = "17QGMjIsGHAcBrwDf4CCkGkXj-exQmx-ueWDWYVnq8IE";
  const apiKey = "AIzaSyA3L11SNodU2AV_au51wXzH6adYE-RgRTA";
  const sheetName = "Raw Songbook Data";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

  const [songs, setSongs] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);

  const yearIndex = songs[0]?.findIndex(
    (header: string) => header.toLowerCase() === "year"
  );

  const songsByYear =
  yearIndex !== undefined && yearIndex !== -1
    ? songs.slice(1).sort((a, b) => {
        const yearA = a[yearIndex]?.toString().trim() || "";
        const yearB = b[yearIndex]?.toString().trim() || "";
        if (yearA === "" && yearB === "") return 0;
        if (yearA === "") return 1;
        if (yearB === "") return -1;
        return yearA.localeCompare(yearB);
      })
    : songs.slice(1);

  const showIndex = songs[0]?.findIndex(
    (header: string) => header.toLowerCase() === "show"
  );

  const songsByShow =
  showIndex !== undefined && showIndex !== -1
    ? [...songs.slice(1)].sort((a, b) => {
        const showA = a[showIndex]?.toString().toLowerCase().trim() || "";
        const showB = b[showIndex]?.toString().toLowerCase().trim() || "";
        if (showA === "" && showB === "") return 0;
        if (showA === "") return 1;
        if (showB === "") return -1;
        return showA.localeCompare(showB);
      })
    : songs.slice(1);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSongs(data.values);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <VStack
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        gap="24px"
      >
        <ScaleLoader
          color="var(--foreground)"
          width="25"
          height="65"
          speedMultiplier={0.6666}
        />
        <Text
          fontFamily='"Ojuju", serif'
          color="var(--foreground)"
          fontWeight="bold"
          fontSize="24px"
        >
          Loading...
        </Text>
      </VStack>
    );
  }

  const selectedTabStyle = {
    bg: "var(--foreground)",
    color: "var(--background)",
    opacity: 1,
  };

  return (
    <VStack bg="var(--background)">
      <Tabs w="100%" variant="soft-rounded">
        <TabList bg="var(--background-alt)" p="16px" flexWrap="wrap" gap="8px">
          <Styled.Tab _selected={selectedTabStyle}>
            <Icon as={FaMusic} /> Title
          </Styled.Tab>
          <Styled.Tab _selected={selectedTabStyle}>
            <Icon as={FaCalendarAlt} />
            Year
          </Styled.Tab>
          <Styled.Tab _selected={selectedTabStyle}>
            <Icon as={FaMasksTheater} />
            Show
          </Styled.Tab>
        </TabList>

        <TabPanels overflowX="auto">
          <TabPanel padding="0">
            <Table variant="simple" margin="0" padding="0">
              <Thead>
                <Tr>
                  {songs[0]?.map((header: string, index: number) => (
                    <Th
                      key={index}
                      fontFamily='"Ojuju", serif'
                      textTransform="capitalize"
                      fontSize="xl"
                      color="var(--foreground)"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {songs.slice(1).map((row: any[], rowIndex: number) => (
                  <Tr
                    key={rowIndex}
                    bg={
                      rowIndex % 2 === 0
                        ? "var(--background-alt)"
                        : "var(--background)"
                    }
                  >
                    {row.map((cell: any, cellIndex: number) => (
                      <Td key={cellIndex}>{cell !== "" ? cell : "\u00A0"}</Td>
                    ))}
                    {Array(songs[0].length - row.length)
                      .fill(null)
                      .map((_, cellIndex) => (
                        <Td key={row.length + cellIndex}>&nbsp;</Td>
                      ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel padding="0">
            <Table variant="simple" margin="0" padding="0">
              <Thead>
                <Tr>
                  {songs[0]?.map((header: string, index: number) => (
                    <Th
                      key={index}
                      fontFamily='"Ojuju", serif'
                      textTransform="capitalize"
                      fontSize="xl"
                      color="var(--foreground)"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {songsByYear.map((row: any[], rowIndex: number) => (
                  <Tr
                    key={rowIndex}
                    bg={
                      rowIndex % 2 === 0
                        ? "var(--background-alt)"
                        : "var(--background)"
                    }
                  >
                    {row.map((cell: any, cellIndex: number) => (
                      <Td key={cellIndex}>{cell !== "" ? cell : "\u00A0"}</Td>
                    ))}
                    {Array(songs[0].length - row.length)
                      .fill(null)
                      .map((_, cellIndex) => (
                        <Td key={row.length + cellIndex}>&nbsp;</Td>
                      ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel padding="0">
            <Table variant="simple" margin="0" padding="0">
              <Thead>
                <Tr>
                  {songs[0]?.map((header: string, index: number) => (
                    <Th
                      key={index}
                      fontFamily='"Ojuju", serif'
                      textTransform="capitalize"
                      fontSize="xl"
                      color="var(--foreground)"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {songsByShow.map((row: any[], rowIndex: number) => (
                  <Tr
                    key={rowIndex}
                    bg={
                      rowIndex % 2 === 0
                        ? "var(--background-alt)"
                        : "var(--background)"
                    }
                  >
                    {row.map((cell: any, cellIndex: number) => (
                      <Td key={cellIndex}>{cell !== "" ? cell : "\u00A0"}</Td>
                    ))}
                    {Array(songs[0].length - row.length)
                      .fill(null)
                      .map((_, cellIndex) => (
                        <Td key={row.length + cellIndex}>&nbsp;</Td>
                      ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
