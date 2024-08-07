"use client";

import axios from "axios";
import { useState } from "react";
import UserCard from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import { UserCardProps } from "@/libs/types";
import {useEffect} from "react"

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState<UserCardProps[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const jsonStr = JSON.stringify(genAmount);
    localStorage.setItem('genAmount', jsonStr);
  },[genAmount]);  // Only run useEffect if isFirstLoad changes)

  useEffect(() => {
    const jsonStr = localStorage.getItem('genAmount');
    if (jsonStr !== null) {
        const newGenAmount = JSON.parse(jsonStr);
        setGenAmount(newGenAmount);
      }

  },[]);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    const cleanedUsers = users.map(cleanUser);
    setUsers(cleanedUsers);
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange = {(e) => setGenAmount (+e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user)=> (<UserCard key = {user.email} {...user}/>))}
    </div>
  );
}