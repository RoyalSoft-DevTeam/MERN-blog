import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IPost {
  _id: string;
  title: string;
  body: string;
  author: {
    [key: string]: any;
  };
  date: Date;
  published: boolean;
  imageUrl: string;
  setPosts: any;
}

interface IAuthor {
  _id: string;
  username: string;
}

function UpdateForm({
  _id,
  title,
  body,
  author,
  date,
  published,
  imageUrl,
  setPosts,
}: IPost) {
  const navigate = useNavigate();
  const [postTitle, setPostTitle] = useState<string>(title);
  const [postBody, setPostBody] = useState<string>(body);
  const [postAuthor, setPostAuthor] = useState<IAuthor>(
    JSON.parse(localStorage.getItem("user")!).user
  );
  const [postDate, setPostDate] = useState<any>(new Date());
  const [postPublished, setPostPublished] = useState<boolean>(published);
  const [postImageUrl, setPostImageUrl] = useState<string>(imageUrl);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    title = postTitle;
    body = postBody;
    author = postAuthor;
    date = postDate;
    published = postPublished;
    imageUrl = postImageUrl;
    let data = JSON.stringify({
      title,
      body,
      author,
      date,
      published,
      imageUrl,
    });
    axios
      .put(`/api/posts/${_id}/update`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${
            JSON.parse(localStorage.getItem("user")!).token
          }`,
        },
      })
      .then((res) => {
        setPosts((prevState: IPost[]) => {
          return prevState.map((post: IPost) =>
            _id === post._id ? res.data : post
          );
        });
        axios.get("/api/posts").then((res) => {
          setPosts(res.data);
        });
        navigate("/");
      })
      .catch((err) => console.log(err.response.data));
  };

  useEffect(() => {
    document.title = "Update | MERN Blog";
  }, []);

  return (
    <>
      <div className="z-[-10] bg-black-500 w-4/5 md:w-1/2 mt-24 absolute left-1/2 -translate-x-1/2">
        <div className="border-2 p-10 shadow-xl rounded-md">
          <h1 className="text-purple-600 text-2xl md:text-3xl font-bold pb-4">
            Update your blog
          </h1>
          <form onSubmit={(e) => handleUpdate(e)}>
            {/* Post title */}
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={postTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPostTitle(e.target.value)
              }
              className="w-full mb-2 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />

            {/* Post body */}
            <label htmlFor="body">Content</label>
            <textarea
              name="body"
              placeholder="Content"
              value={postBody}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPostBody(e.target.value)
              }
              className="w-full text-gray-900 text-base leading-5 h-40
                rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm
                outline-0 focus:border-purple-400 resize-none"
              required
            ></textarea>

            {/* Post image  */}
            <label htmlFor="image">Image</label>
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={postImageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPostImageUrl(e.target.value)
              }
              className="w-full mb-2 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />
            <div>
              <button className="px-4 sm:px-8 py-1 mt-2 rounded border-2 border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateForm;
