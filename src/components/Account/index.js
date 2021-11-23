import React from 'react';
import { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import { StyledInput, StyledButton } from '../../styles';
import PasswordChangeForm from '../PasswordChange';
import { COLORS } from '../../constants/designConstants';

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      fileUrl: null,
      progress: 0,
      errorMsg: null
    }
  }

  onFileChange = event => {
    if (event.target.files[0]) {
      this.setState({ selectedFile: event.target.files[0] })
    }
  }

  onUploadFile = () => {
    if (this.state.selectedFile === null) {
      this.setState({
        errorMsg: "No file chosen"
      });
      return;
    }

    const uploadTask = this.props.firebase.storage.ref(`images/${this.state.selectedFile.name}`).put(this.state.selectedFile);
    this.setState({
      errorMsg: null,
      successMsg: null,
      loadingMsg: "Loading image... Please wait"
    })

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: progress });
      },
      error => {
        console.log(error);
      },
      () => {
        this.props.firebase.storage
          .ref('images')
          .child(this.state.selectedFile.name)
          .getDownloadURL()
          .then(url => {
            this.setState({
              fileUrl: url,
              errorMsg: null,
              loadingMsg: null,
              successMsg: "Image uploaded successfully."
            });

            let id = this.props.firebase.authUser.uid;
            this.props.firebase.user(id).update({
              profileImage: url
            })
          });
      }
    )
  }

  onRemoveProfilePicture = () => {
    let id = this.props.firebase.authUser.uid;
    this.props.firebase.user(id).update({
      profileImage: ''
    });
    this.setState({
      successMsg: "Image removed successfully."
    });
  }

  render() {
    return (<AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Account: {this.props.firebase.authUser.username}</h1>
          <h3>Forgot password?</h3>
          <PasswordForgetForm />
          <br />
          
          <h3>Change password</h3>
          <PasswordChangeForm />
          <br />
          
          <h3>Edit profile picture</h3>
          <input type="file" onChange={this.onFileChange} />
          <br />
          <StyledButton onClick={this.onUploadFile}>Upload Profile Image</StyledButton>
          <StyledButton onClick={this.onRemoveProfilePicture} marginLeft="15px">Remove Profile Picture</StyledButton>
          <br></br>
          <progress value={this.state.progress} max="100" />

          {this.state.loadingMsg !== null && <p style={{ color: COLORS.primaryBlue }}>{this.state.loadingMsg}</p>}
          {this.state.successMsg !== null && <p style={{ color: COLORS.success }}>{this.state.successMsg}</p>}
          {this.state.errorMsg !== null && <p style={{ color: COLORS.error }}>{this.state.errorMsg}</p>}
        </div>
      )
      }
    </AuthUserContext.Consumer>
    )
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);