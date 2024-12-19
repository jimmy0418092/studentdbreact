import { useEffect, useRef, useState } from 'react';
import '../style/App.css';
import { asyncGet, asyncPost, asyncPut, asyncDelete } from '../utils/fetch';
import { api } from '../enum/api';
import { Student } from '../interface/Student';
import { resp } from '../interface/resp';

function App() {
  const [students, setStudents] = useState<Array<Student>>([]);
  const [newStudent, setNewStudent] = useState<Student>({
    _id: '',
    userName: '',
    sid: '',
    name: '',
    department: '',
    grade: '',
    class: '',
    Email: '',
    absences: 0,
  });
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const cache = useRef<boolean>(false);

  useEffect(() => {
    if (!cache.current) {
      cache.current = true;
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    const res: resp<Array<Student>> = await asyncGet(api.findAll);
    if (res.code === 200) {
      setStudents(res.body);
    }
  };

  const handleCreate = async () => {
    const res: resp<Student> = await asyncPost(api.create, newStudent);
    if (res.code === 200) {
      setStudents([...students, res.body]);
      setNewStudent({
        _id: '',
        userName: '',
        sid: '',
        name: '',
        department: '',
        grade: '',
        class: '',
        Email: '',
        absences: 0,
      });
    }
  };

  const handleUpdate = async () => {
    if (editStudent) {
      const res: resp<Student> = await asyncPut(`${api.update}/${editStudent._id}`, editStudent);
      if (res.code === 200) {
        setStudents(
          students.map((student) => (student._id === editStudent._id ? res.body : student))
        );
        setEditStudent(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res: resp<null> = await asyncDelete(`${api.delete}/${id}`);
    if (res.code === 200) {
      setStudents(students.filter((student) => student._id !== id));
    }
  };

  const studentList = students
    ? students.map((student: Student) => {
        return (
          <div className="student" key={student._id}>
            <p>帳號: {student.userName}</p>
            <p>座號: {student.sid}</p>
            <p>姓名: {student.name}</p>
            <p>院系: {student.department}</p>
            <p>年級: {student.grade}</p>
            <p>班級: {student.class}</p>
            <p>Email: {student.Email}</p>
            <p>缺席次數: {student.absences ? student.absences : 0}</p>
            <button onClick={() => setEditStudent(student)}>編輯</button>
            <button onClick={() => handleDelete(student._id)}>刪除</button>
          </div>
        );
      })
    : 'loading';

  return (
    <>
      <div className="container">
        <h1>學生管理系統</h1>

        {/* 新增學生表單 */}
        <div className="form">
          <h2>新增學生</h2>
          <input
            type="text"
            placeholder="帳號"
            value={newStudent.userName}
            onChange={(e) => setNewStudent({ ...newStudent, userName: e.target.value })}
          />
          {/* 其他表單輸入框 */}
          <button onClick={handleCreate}>新增</button>
        </div>

        {/* 學生清單 */}
        {studentList}

        {/* 編輯學生表單 */}
        {editStudent && (
          <div className="form">
            <h2>編輯學生</h2>
            {/* 編輯表單輸入框 */}
            <button onClick={handleUpdate}>更新</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
