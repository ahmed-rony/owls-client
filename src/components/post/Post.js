import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import moment from "moment";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {currentUser} = useContext(AuthContext);

  // for fetching
  const { isLoading, error, data } = useQuery(['likes', post.id], () =>
    makeRequest.get("/likes?postId="+post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();
  // Mutations  =====  for post/ delete/ updates
  const mutation = useMutation({
    mutationFn: (liked) => {
      if(liked) return makeRequest.delete('/likes?postId='+ post.id);
      return makeRequest.post('/likes', {postId: post.id})
      
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['likes'] });
    },
  })
  
  
  const handleLike = () =>{
    mutation.mutate(data.includes(currentUser.id))
  }
  
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete('/posts/'+ postId)
      
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  })
  const handleDelete = () =>{
    deleteMutation.mutate(post.id)
  }
  
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createDate).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=> setMenuOpen(!menuOpen)} />
          {(menuOpen && post.userId === currentUser.id) && <button onClick={handleDelete}>Delete</button>}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/"+post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading 
            ? 'Loading..'
            : data.includes(currentUser.id) ? <FavoriteOutlinedIcon onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}
            {/* {data.length} Likes */}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
