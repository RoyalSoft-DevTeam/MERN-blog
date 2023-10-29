import { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";

interface IComment {
  _id: string;
  username: string;
  text: string;
  postId: string;
  date: Date;
}

interface IProps {
  user: any;
  postId: string;
  comments: IComment[];
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}

function Comments({ user, postId, comments, setComments }: IProps) {
  const [text, setText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string>("");

  const handleUpdate = (updateComment: IComment): void => {
    axios
      .put(
        `/api/posts/${postId}/comments/${updateComment._id}/update`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${
              JSON.parse(localStorage.getItem("user")!).token
            }`,
          },
        }
      )
      .then((res) => {
        setIsEditing(false);
        setComments((prevState) => {
          return prevState.map((comment: IComment) =>
            updateComment._id === comment._id ? res.data : comment
          );
        });
      })
      .catch((err) => console.log(err.response.data));
  };

  const startEditing = (comment: IComment): void => {
    setIsEditing(true);
    setEditingCommentId(comment._id);
  };

  const handleDelete = (deleteComment: IComment): void => {
    axios
      .delete(`/api/posts/${postId}/comments/${deleteComment._id}/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${
            JSON.parse(localStorage.getItem("user")!).token
          }`,
        },
      })
      .then(() => {
        setComments((prevState) => {
          return prevState.filter(
            (comment: IComment) => comment._id !== deleteComment._id
          );
        });
      })
      .catch((err) => console.log(err.response.data));
  };

  useEffect(() => {
    axios
      .get(`/api/posts/${postId}/comments`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => console.log(err.response.data));
  }, [isEditing]);

  return (
    <>
      <div>
        {comments
          .slice(0)
          .reverse()
          .map((comment: IComment, i: number) => {
            return (
              <div
                key={i}
                className="p-2 my-4 border rounded shadow-sm hover:shadow-lg"
              >
                <div className="flex justify-between">
                  <h3 className="text-sm sm:text-md font-semibold">
                    {comment.username}
                  </h3>
                  <p className="text-xs sm:text-md">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
                <p
                  hidden={
                    isEditing && comment._id === editingCommentId ? true : false
                  }
                >
                  {comment.text}
                </p>
                <div
                  hidden={
                    isEditing && comment._id === editingCommentId ? false : true
                  }
                >
                  {/* Update text form */}
                  <form onSubmit={() => handleUpdate(comment)}>
                    <label htmlFor="text">Text</label>
                    <br />
                    <input
                      type="text"
                      name="text"
                      placeholder="Text"
                      defaultValue={comment.text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setText(e.target.value)
                      }
                      className="w-full mb-2 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
                      required
                    />
                  </form>
                </div>
                <div
                  className="m-auto"
                  hidden={
                    isEditing && comment._id === editingCommentId ? false : true
                  }
                >
                  <button
                    className="px-2 py-1 mt-2 rounded border border-red-600 text-red-600 duration-300 hover:text-white hover:bg-red-600"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-2 py-1 mt-2 rounded border border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600"
                    onClick={() => handleUpdate(comment)}
                  >
                    Update
                  </button>
                </div>
                <div
                  className="m-auto"
                  hidden={
                    user &&
                    JSON.parse(localStorage.getItem("user")!).user.username ===
                      comment.username
                      ? false
                      : true
                  }
                >
                  <button
                    onClick={() => startEditing(comment)}
                    hidden={isEditing ? true : false}
                    className="px-2 py-1 mt-2 rounded border border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(comment)}
                    hidden={isEditing ? true : false}
                    className="px-2 py-1 mt-2 rounded border border-red-600 text-red-600 duration-300 hover:text-white hover:bg-red-600"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Comments;
