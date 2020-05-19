import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './ProgressBar';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; 
import GetFiles from './GetFiles'
import { Link } from 'react-router-dom';
import DragFile from './DragFile';


const Upload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [message, setMessage] = useState('');

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formdata = new FormData();
    const token = localStorage.usertoken
   //const decoded = jwt_decode(token) 
    formdata.append('file', file);
    formdata.append('passcode', "123");
    formdata.append('path', '/'+file.name);

    console.log(localStorage)
    console.log(token)

    try {
      const res = await axios.post('/api/file/upload', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          'Authorization': token
        },
        Upload_Progress: progress => {
          setUploadPercentage(
            parseInt(
              Math.round((progress.loaded * 100) / progress.total)
            )
          );

          // Clear percentage Bar after 10 seconds 
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
       <div className='container'>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <Progress percentage={uploadPercentage} />
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
      <Link to = '/docs/files'><button class = "btn btn-success"> View Files </button></Link>
      </div>
    </Fragment>
    
  );
};

export default Upload;