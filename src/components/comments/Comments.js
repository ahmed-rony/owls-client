import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState('');

  const { isLoading, error, data } = useQuery(['comments'], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();
  // Mutations
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post('/comments', newComment)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  })

  const handleComment = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId: postId });
    setDesc('');
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={"./upload/"+currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" onChange={e => setDesc(e.target.value)} value={desc} />
        <button onClick={handleComment}>Send</button>
      </div>
      {isLoading
        ? 'Loading..'
        : data.map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="info">
                <img src={"/upload/"+comment.profilePic} alt="" />
              <div className="user">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>

            </div>
            <span className="date">{moment(comment.createDate).fromNow()}</span>
          </div>
        ))}
    </div>
  );
};

export default Comments;
