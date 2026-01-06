import React from 'react';
import { Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleAddUser } from './service.js';

const schema = Yup.object().shape({
    username: Yup.string().required('שם משתמש הוא שדה חובה'),
    password: Yup.string().required('סיסמה היא שדה חובה').min(6, 'הסיסמה חייבת לכלול לפחות 6 תווים'),
    email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
    phone: Yup.string().required('טלפון הוא שדה חובה').matches(/^[0-9]+$/, 'טלפון חייב להיות מספרי'),
    role: Yup.string().required('תפקיד הוא שדה חובה'),
});

const AddUserModal = ({ show, handleClose, refreshUsers }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await handleAddUser(data); // שליחה של המידע המלא
            handleClose(); // סגירת המודאל
            refreshUsers(); // רענון הרשימה
        } catch (error) {
            alert("שגיאה במהלך ההוספה: " + error.message);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>הוסף משתמש חדש</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errors.username && <div className="text-danger">{errors.username.message}</div>}
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="text"
                                placeholder="שם משתמש"
                                {...field}
                                className={`form-control mb-2 ${errors.username ? 'is-invalid' : ''}`}
                            />
                        )}
                    />

                    {errors.password && <div className="text-danger">{errors.password.message}</div>}
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="password"
                                placeholder="סיסמה"
                                {...field}
                                className={`form-control mb-2 ${errors.password ? 'is-invalid' : ''}`}
                            />
                        )}
                    />

                    {errors.email && <div className="text-danger">{errors.email.message}</div>}
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="email"
                                placeholder="אימייל"
                                {...field}
                                className={`form-control mb-2 ${errors.email ? 'is-invalid' : ''}`}
                            />
                        )}
                    />

                    {errors.phone && <div className="text-danger">{errors.phone.message}</div>}
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="text"
                                placeholder="טלפון"
                                {...field}
                                className={`form-control mb-2 ${errors.phone ? 'is-invalid' : ''}`}
                            />
                        )}
                    />

                    {errors.role && <div className="text-danger">{errors.role.message}</div>}
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="text"
                                placeholder="תפקיד"
                                {...field}
                                className={`form-control mb-2 ${errors.role ? 'is-invalid' : ''}`}
                            />
                        )}
                    />

                    <button type="submit" className="btn btn-primary">הוסף משתמש</button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>סגור</button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUserModal;