import React, { Component } from 'react';
import axios from 'axios';

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            association: '',
            message: '',
            error_message: '',
	    };
    };
	

render() {
    return(
        <div className="form-container">
            <form id="contact-form">
                <div className="form-group" id="fname-form">
                    <label htmlFor="firstName">First Name<span className="asterisk">*</span></label>
                    <input name="firstName" type="text" className="form-control" value={this.state.firstName}
                        onChange={this.onInputChange.bind(this)} />
                </div>

                <div className="form-group" id="lname-form">
                    <label htmlFor="lastName">Last Name<span className="asterisk">*</span></label>
                    <input name="lastName" type="text" className="form-control" value={this.state.lastName}
                        onChange={this.onInputChange.bind(this)} />
                </div>

                <div className="form-group" id="email-form">
                    <label htmlFor="email">Email<span className="asterisk">*</span></label>
                    <input name="email" type="email" className="form-control" value={this.state.email}
                        onChange={this.onInputChange.bind(this)} />
                </div>

                <div className="form-group">
                    <label htmlFor="association">Association</label>
                    <input name="association" type="text" className="form-control" value={this.state.association}
                        onChange={this.onInputChange.bind(this)} />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message<span className="asterisk">*</span></label>
                    <textarea name="message" className="form-control" rows="5" value={this.state.message}
                        onChange={this.onInputChange.bind(this)} />
                </div>
                <p className="error-msg">{this.state.error_message}</p>

                <div className="btn-container">
                    <button type="submit" className="contact-btn" onClick={event => this.handleSubmit(event)}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

    onInputChange = event => {
        this.setState({[event.target.name]: event.target.value});
        console.log(this.state);
    };

    handleSubmit = event => {
        event.preventDefault();

        if (this.state.firstName === '' || this.state.lastName === '' || this.state.email === '' || this.state.message === '') {
            this.setState({ error_message: 'Please fill out all required fields marked with an asterisk' })
        } else {
            this.setState({ error_message: '' })
            console.log(this.state);
        };
    };
};

export default ContactForm;