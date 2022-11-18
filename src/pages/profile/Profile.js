import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Update from "../../components/Update/Update";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {currentUser} = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split('/')[2]);

  const { isLoading, error, data } = useQuery(['user'], () =>
    makeRequest.get("/users/find/"+userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rsLoading, data: relationshipData } = useQuery(['relationship'], () =>
    makeRequest.get("/relationships?followedUserId="+userId).then((res) => {
      return res.data;
    })
  );

  // https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=600
  const queryClient = useQueryClient();
  // Mutations  =====  for post/ delete/ updates
  const mutation = useMutation({
    mutationFn: (following) => {
      if(following) return makeRequest.delete('/relationships?userId='+ userId);
      return makeRequest.post('/relationships', {userId})
      
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['relationship'] });  // refetching relationship at useQuery;
    },
  })

  const handleFollow = () =>{
    mutation.mutate(relationshipData.includes(currentUser.id))
  }

  return (
    <div className="profile">
      { isLoading 
      ? "Loading.."
      : <>
        <div className="images">
          <img
            src={"/upload/"+data.coverPic}
            alt=""
            className="cover"
          />
          <img
            src={"/upload/"+data.profilePic}
            alt=""
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{data.name}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{data.website}</span>
                </div>
              </div>
              {rsLoading ? "Loading.." :
                userId === currentUser.id
                ? <button onClick={handleOpen}>Update</button>
                : <button onClick={handleFollow}>{ relationshipData.includes(currentUser.id) ? "Following" : "Follow"}</button>
              }
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
        <Posts userId={userId} />
        </div>
        </>
      }
      {open && <Update handleClose={handleClose} open={open} user={data}></Update>}
    </div>
  );
};

export default Profile;
