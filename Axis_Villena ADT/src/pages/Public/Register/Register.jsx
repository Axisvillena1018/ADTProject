import { useState, useRef, useCallback, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [firstName, setfirstName] = useState('');
    const [middleName, setmiddleName] = useState('');
    const [lastName, setlastName] = useState('');
    const [contactNo, setcontactNo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFieldsDirty, setIsFieldsDirty] = useState(false);
    const emailRef = useRef();
    const firstNameRef = useRef();
    const middleNameRef = useRef();
    const lastNameRef = useRef();
    const contactRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const userInputDebounce = useDebounce({ email, password, confirmPassword }, 2000);
    const [debounceState, setDebounceState] = useState(false);
    const [status, setStatus] = useState('idle');

    const navigate = useNavigate();

    const handleShowPassword = useCallback(() => {
        setIsShowPassword((value) => !value);
    }, [isShowPassword]);

    const handleOnChange = (event, type) => {
        setDebounceState(false);
        setIsFieldsDirty(true);

        switch (type) {
            case 'email':
                setEmail(event.target.value);
                break;
            case 'firstName':
                setfirstName(event.target.value)
                break;
            case 'middleName':
                setmiddleName(event.target.value)
                break;
            case 'lastName':
                setlastName(event.target.value)
                break;
            case 'contactNo':
                setcontactNo(event.target.value)
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(event.target.value);
                break;
            default:
                break;
        }
    };

    const handleRegister = async () => {
        const data = { email, password, firstName, middleName, lastName, contactNo };
        setStatus('loading');
        console.log(data);

        await axios({
            method: 'post',
            url: '/admin/register',
            data,
            headers: { 'Access-Control-Allow-Origin': '*' },
        })
            .then((res) => {
                console.log(res);
                alert('Registration successful! Please proceed to Login.');
                navigate('/');
                setStatus('idle');
            })
            .catch((e) => {
                console.log(e);
                setStatus('idle');
                alert(e.response?.data?.message || 'Registration failed. Please try again.');
            });
    };

    useEffect(() => {
        setDebounceState(true);
    }, [userInputDebounce]);

    return (
        <div className='Register'>
            <div className='main-container'>
                <h3>Register</h3>
                <form>
                    <div className='form-container'>
                        <div>
                            <div className='form-group'>
                                <label>First Name:</label>
                                <input
                                    type='text'
                                    name='first name'
                                    ref={firstNameRef}
                                    onChange={(e) => handleOnChange(e, 'firstName')}
                                />
                            </div>
                            {debounceState && isFieldsDirty && email === '' && (
                                <span className='errors'>This field is required</span>
                            )}
                        </div>
                        <div>
                            <div className='form-group'>
                                <label>Middle Name</label>
                                <input
                                    type='text'
                                    name='middle name'
                                    ref={middleNameRef}
                                    onChange={(e) => handleOnChange(e, 'middleName')}
                                />
                            </div>
                            {debounceState && isFieldsDirty && firstName === '' && (
                                <span className='errors'>This field is required</span>
                            )}
                        </div>
                        <div>
                            <div className='form-group'>
                                <label>Last Name</label>
                                <input
                                    type='text'
                                    name='last name'
                                    ref={lastNameRef}
                                    onChange={(e) => handleOnChange(e, 'lastName')}
                                />
                            </div>
                            
                        </div>
                        <div>
                            <div className='form-group'>
                                <label>Email</label>
                                <input
                                    type='text'
                                    name='email'
                                    ref={emailRef}
                                    onChange={(e) => handleOnChange(e, 'email')}
                                />
                            </div>
                            {debounceState && isFieldsDirty && lastName === '' && (
                                <span className='errors'>This field is required</span>
                            )}
                        </div>
                        <div>
                            <div className='form-group'>
                                <label>Contact no.</label>
                                <input
                                    type='text'
                                    name='Contact Number'
                                    ref={contactRef}
                                    onChange={(e) => handleOnChange(e, 'contactNo')}
                                />
                            </div>
                            {debounceState && isFieldsDirty && contactNo === '' && (
                                <span className='errors'>This field is required</span>
                            )}
                        </div>
                        <div>
                            <div className='form-group'>
                                <label>Password:</label>
                                <input
                                    type={isShowPassword ? 'text' : 'password'}
                                    name='password'
                                    ref={passwordRef}
                                    onChange={(e) => handleOnChange(e, 'password')}
                                />
                            </div>
                            {debounceState && isFieldsDirty && password === '' && (
                                <span className='errors'>This field is required</span>
                            )}
                        </div>
                        <div>
                            <div className='form-group'>
                                <label>Confirm Password:</label>
                                <input
                                    type={isShowPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    ref={confirmPasswordRef}
                                    onChange={(e) => handleOnChange(e, 'confirmPassword')}
                                />
                            </div>
                            {debounceState && isFieldsDirty && confirmPassword === '' && (
                                <span className='errors'>This field is required</span>
                            )}
                            {debounceState && isFieldsDirty && password !== confirmPassword && (
                                <span className='errors'>Password does not match</span>
                            )}
                        </div>
                        <div className='show-password' onClick={handleShowPassword}>
                            {isShowPassword ? 'Hide' : 'Show'} Password
                        </div>

                        <div className='submit-container'>
                            <button
                                type='button'
                                disabled={status === 'loading'}
                                onClick={() => {
                                    if (status === 'loading') {
                                        return;
                                    }
                                    if (email && password && confirmPassword && password === confirmPassword) {
                                        handleRegister();
                                    } else {
                                        setIsFieldsDirty(true);
                                        if (email === '') {
                                            emailRef.current.focus();
                                        } else if (password === '') {
                                            passwordRef.current.focus();
                                        } else if (confirmPassword === '') {
                                            confirmPasswordRef.current.focus();
                                        }
                                    }
                                }}
                            >
                                {status === 'idle' ? 'Register' : 'Loading'}
                            </button>
                        </div>
                        <div className='login-container'>
                            <a href='/'>
                                <small>Already have an account? Login</small>
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;