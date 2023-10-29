import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";

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
}

interface IProps {
  posts: IPost[];
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

function Dashboard({ posts, setPosts }: IProps) {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")!).user._id;
  const userPosts = posts.filter((post) => userId === post.author._id);
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${JSON.parse(localStorage.getItem("user")!).token
        }`,
    },
  };

  const togglePublish = (toggledPost: IPost): void => {
    const postUrl: String = toggledPost.published ? "unpublish" : "publish";
    axios
      .post(`/api/posts/${toggledPost._id}/${postUrl}/`, {}, headers)
      .then((res) => {
        setPosts((prevState) => {
          return prevState.map((post) =>
            post._id === toggledPost._id ? res.data : post
          );
        });
      })
      .catch((err) => console.log(err.response.data));
  };

  const handleDelete = (deletePost: IPost): void => {
    axios
      .delete(`/api/posts/${deletePost._id}/delete`, headers)
      .then(() => {
        setPosts((prevState) => {
          return prevState.filter((post) => post._id !== deletePost._id);
        });
      })
      .catch((err) => console.log(err.response.data));
  };

  useEffect(() => {
    document.title = "MERN Authentication";
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center m-8">Dashboard</h1>
      <div className="flex flex-row flex-wrap justify-center items-center mx-8 lg:justify-start lg:items-start">
        {userPosts
          .slice(0)
          .reverse()
          .map((post: IPost) => {
            return (
              <div
                className="border-2 m-3 p-2 sm:m-6 sm:p-4 rounded text-center hover:shadow-lg"
                key={post._id}
              >
                <Link to={`/posts/${post._id}`}>
                  <img
                    src={post.imageUrl}
                    className="flex items-center justify-center w-64 h-36 sm:w-80 sm:h-48"
                    alt="post background"
                  />
                </Link>
                <h2 className="text-1xl font-bold pt-2">{post.title}</h2>
                <p className="text-sm py-2">
                  Published: {new Date(post.date).toLocaleString()}
                </p>
                <button
                  onClick={() => togglePublish(post)}
                  className="px-4 py-1 mt-2 rounded border text-sm border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <br />
                <div className="m-auto">
                  <button
                    onClick={() =>
                      navigate(`/posts/${post._id}/update`, {
                        state: { ...post },
                      })
                    }
                    className="px-2 py-1 mt-2 rounded border border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="px-2 py-1 mt-2 rounded border border-red-600 text-red-600 duration-300 hover:text-white hover:bg-red-600"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
