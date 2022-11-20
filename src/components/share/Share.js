import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import { BsImage } from 'react-icons/bs';
import { ImPriceTag } from 'react-icons/im';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');
  const { currentUser } = useContext(AuthContext)

  
  const upload = async () => {
    try {
      const formData = new FormData();  // directly cannot send the file, so we append the info through FormData;
      formData.append('file', file);
      const res = await makeRequest.post('/upload', formData);
      return res.data
    } catch (error) {
      console.log(error);
    }
  }

  const queryClient = useQueryClient();
  // Mutations
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post('/posts', newPost)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });  // in Posts.js- our useQuery name is 'posts', line:7;
    },
  })

  const handlePost = async (e) => {
    e.preventDefault();
    let imgUrl = '';
    if (file) { imgUrl = await upload() };
    mutation.mutate({ desc, img: imgUrl });
    setDesc('');
    setFile(null);
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={"./upload/"+currentUser.profilePic}
              alt=""
            />
            <input type="text" placeholder={`What's on your mind ${currentUser.name}?`} onChange={(e) => setDesc(e.target.value)} value={desc} />

          </div>
          <div className="right">
            {file && <img className="file" src={URL.createObjectURL(file)} alt="" />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <BsImage/>
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <FaMapMarkerAlt/>
              <span>Add Place</span>
            </div>
            <div className="item">
              <ImPriceTag/>
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handlePost}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
