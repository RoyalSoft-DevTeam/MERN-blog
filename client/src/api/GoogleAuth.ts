import axios from "axios";

const login = async (code: String) => {
  // return fetch("/api/users/google", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ code }),
  // }).then((res) => {
  //   if (res.ok) {
  //     return res.json();
  //   } else {
  //     return Promise.reject(res);
  //   }
  // });

  console.log(JSON.stringify({ code }));
  return await axios
    .post("/api/users/google", JSON.stringify({ code }))
    .then((res: any) => {
      console.log(res);
      if (res.ok) {
        return res.json();
      } else {
        return;
      }
    });
};

export { login };
