import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleAddUser, updateUser } from './service.js';

const schema = Yup.object().shape({
    username: Yup.string().required('שם משתמש הוא שדה חובה'),
    password: Yup.string()
        .nullable()
        .transform(value => value || null)
        .when('$isEdit', {
            is: false,
            then: (schema) => schema.required('סיסמה היא שדה חובה').min(6, 'הסיסמה חייבת לכלול לפחות 6 תווים'),
            otherwise: (schema) => schema.min(6, 'הסיסמה חייבת לכלול לפחות 6 תווים')
        }),
    email: Yup.string()
        .email('אימייל לא חוקי')
        .required('אימייל הוא שדה חובה'),
    phone: Yup.string()
        .required('טלפון הוא שדה חובה')
        .matches(/^[0-9]+$/, 'טלפון חייב להיות מספרי'),
    role: Yup.string().required('תפקיד הוא שדה חובה'),
});

const AddUserModal = ({ show, handleClose, refreshUsers, setUsers, userData }) => {
    const isEdit = !!userData?._id;

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        context: { isEdit },
        defaultValues: userData || { username: '', password: '', email: '', phone: '', role: '' },
    });

    // עדכן את הטופס כשמשתנה userData
    useEffect(() => {
        if (show) {
            if (userData && userData._id) {
                reset(userData);
            } else {
                reset({ username: '', password: '', email: '', phone: '', role: '' });
            }
        }
    }, [show, userData, reset]);

    const onSubmit = async (data) => {
        try {
            let result;
            let submitData = { ...data };
    
            if (isEdit && !data.password) {
                const { password, ...dataWithoutPassword } = submitData;
                submitData = dataWithoutPassword;
            }
            if (isEdit) {
                result = await updateUser(userData._id, submitData);
                setUsers(prevUsers => prevUsers.map(user => 
                    user._id === result.user._id ? result.user : user
                ));
                alert(`המשתמש ${result.user.username} עודכן בהצלחה!`);
            } else {
                result = await handleAddUser(submitData);
                setUsers(prevUsers => [...prevUsers, result.user]);
                alert(`המשתמש ${result.user.username} נוסף בהצלחה!`);
            }
            
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            alert('שגיאה בשמירה: ' + (error.message || 'בדוק את הקונסול'));
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'עדכן משתמש' : 'הוסף משתמש חדש'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* שם משתמש */}
                    {errors.username && <div className="text-danger small mb-2">{errors.username.message}</div>}
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

                    {/* סיסמה */}
                    {errors.password && <div className="text-danger small mb-2">{errors.password.message}</div>}
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="password"
                                placeholder={isEdit ? "סיסמה (לא חובה לעריכה)" : "סיסמה"}
                                {...field}
                                className={`form-control mb-2 ${errors.password ? 'is-invalid' : ''}`}
                            />
                        )}
                    />

                    {/* אימייל */}
                    {errors.email && <div className="text-danger small mb-2">{errors.email.message}</div>}
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

                    {/* טלפון */}
                    {errors.phone && <div className="text-danger small mb-2">{errors.phone.message}</div>}
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

                    {/* תפקיד */}
                    {errors.role && <div className="text-danger small mb-2">{errors.role.message}</div>}
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

                    <button type="submit" className="btn btn-primary w-100">
                        {isEdit ? 'שמור שינויים' : 'הוסף משתמש'}
                    </button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>סגור</button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUserModal;