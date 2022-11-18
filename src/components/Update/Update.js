import { Backdrop, Box, Fade, Modal } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { makeRequest } from '../../axios';
import './Update.css';

const Update = ({ handleClose, open, user }) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
        name: '',
        city: '',
        website: ''
    });


    const upload = async (file) => {
        try {
            const formData = new FormData();  // directly cannot send the file, so we append the info through FormData;
            formData.append('file', file);
            const res = await makeRequest.post('/upload', formData);
            return res.data
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    
  const queryClient = useQueryClient();
  // Mutations
  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put('/users', user)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user'] });  // in Profile.js- our useQuery name is 'user', line:7;
    },
  })
  console.log(user);
  const handleUpdate = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    console.log(coverUrl);
    mutation.mutate({...texts, coverPic: coverUrl, profilePic: profileUrl });
    handleClose();
    };

    return (
        <div className='update'>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box className='update-modal'>
                        <form>
                            <input type="file" name="coverPic" onChange={e => setCover(e.target.files[0])} />
                            <input type="file" name="profilePic" onChange={e => setProfile(e.target.files[0])} />
                            <input type="text" name="name" onChange={handleChange} placeholder='Name' />
                            <input type="text" name="city" onChange={handleChange} placeholder='City' />
                            <input type="text" name="website" onChange={handleChange} placeholder='Website' />
                            <button onClick={handleUpdate}>Update</button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );

}
export default Update;