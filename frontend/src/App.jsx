import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  course: '',
  department: '',
  enrollmentDate: '',
  status: 'ACTIVE'
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ firstName: '', lastName: '', course: '', department: '', status: '' });

  const loadStudents = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    axios.get(`${API_BASE}/students?${params.toString()}`)
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  };

  useEffect(() => {
    loadStudents();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, enrollmentDate: form.enrollmentDate || null };

    if (editingId) {
      axios.put(`${API_BASE}/students/${editingId}`, payload)
        .then(() => {
          setForm(emptyForm);
          setEditingId(null);
          loadStudents();
        });
      return;
    }

    axios.post(`${API_BASE}/students`, payload)
      .then(() => {
        setForm(emptyForm);
        loadStudents();
      });
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      course: student.course,
      department: student.department,
      enrollmentDate: student.enrollmentDate,
      status: student.status
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE}/students/${id}`)
      .then(() => loadStudents());
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Student Management</div>
      </header>

      <main className="container">
        <section className="panel">
          <h2>{editingId ? 'Update Student' : 'Add Student'}</h2>
          <form className="student-form" onSubmit={handleSubmit}>
            <div className="row">
              <input name="firstName" value={form.firstName} placeholder="First name" onChange={handleChange} required />
              <input name="lastName" value={form.lastName} placeholder="Last name" onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange} required />
              <input name="phone" value={form.phone} placeholder="Phone" onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="course" value={form.course} placeholder="Course" onChange={handleChange} required />
              <input name="department" value={form.department} placeholder="Department" onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="enrollmentDate" type="date" value={form.enrollmentDate} onChange={handleChange} required />
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="GRADUATED">Graduated</option>
              </select>
            </div>
            <button type="submit">{editingId ? 'Update Student' : 'Create Student'}</button>
          </form>
        </section>

        <section className="panel">
          <h2>Filters</h2>
          <div className="filter-grid">
            <input name="firstName" value={filters.firstName} placeholder="First name" onChange={handleFilterChange} />
            <input name="lastName" value={filters.lastName} placeholder="Last name" onChange={handleFilterChange} />
            <input name="course" value={filters.course} placeholder="Course" onChange={handleFilterChange} />
            <input name="department" value={filters.department} placeholder="Department" onChange={handleFilterChange} />
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="GRADUATED">Graduated</option>
            </select>
          </div>
        </section>

        <section className="panel">
          <h2>Student List</h2>
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-card">
                <div className="student-header">
                  <h3>{student.firstName} {student.lastName}</h3>
                  <span className="status-pill">{student.status}</span>
                </div>
                <p>{student.email}</p>
                <p>{student.phone}</p>
                <p>{student.course} • {student.department}</p>
                <p>Enrolled: {student.enrollmentDate}</p>
                <div className="actions">
                  <button className="secondary" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(student.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
