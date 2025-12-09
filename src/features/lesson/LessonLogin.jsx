import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CourseComponent = () => {
  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">מערכת ניהול קורסים</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">בית</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">קורסים</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">אזור אישי</a>
            </li>
          </ul>
        </div>
        <button className="btn btn-danger">יציאה</button>
      </nav>

      <h2 className="mt-4">נושאים ללימוד</h2>
      <div className="list-group mt-3">
        <div className="list-group-item">
          <h5>animals</h5>
          <button className="btn btn-primary mr-2">בואו נתחיל</button>
          <button className="btn btn-secondary">בואו נתרגל</button>
        </div>
        <div className="list-group-item">
          <h5>bool</h5>
          <button className="btn btn-primary mr-2">בואו נתחיל</button>
          <button className="btn btn-secondary">בואו נתרגל</button>
        </div>
        <div className="list-group-item">
          <h5>vehicle</h5>
          <button className="btn btn-primary mr-2">בואו נתחיל</button>
          <button className="btn btn-secondary">בואו נתרגל</button>
        </div>
      </div>
    </div>
  );
}

export default CourseComponent;