import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import client from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditArtikel = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tag, setTag] = useState('');
    const [thumbnail, setThumbnail] = useState();

    const navigate = useNavigate();
    const { id } = useParams();

    const fetchArtikel = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await client.get(`/artikel/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.status === true) {
                setTitle(res.data.data.artikel[0].judul);
                setBody(res.data.data.artikel[0].isi);
                setTag(res.data.data.artikel[0].tag);
                setThumbnail(res.data.data.artikel[0].thumbnail);
            }
        } catch (error) {
            toast.error('Internal Server Error!');
            console.log(error);
        }
    };

    useEffect(() => {
        fetchArtikel();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            thumbnail: thumbnail,
            judul: title,
            isi: body,
            tag: tag,
        };

        try {
            const token = localStorage.getItem('token');
            const res = await client.put(`/artikel/${id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            if (res.data.status === true) {
                toast.success('Berhasil Edit Artikel!');
                setTimeout(() => {
                    navigate('/artikel');
                    window.location.reload();
                }, 3000);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Internal Server Error');
            console.log(error);
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-5">Edit Artikel</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-full mb-2">
                    <label className="mb-2 font-medium" htmlFor="title">
                        Judul
                    </label>
                    <input
                        className="px-3 py-2 mb-2 border-2 border-slate-400 rounded-md focus:outline-meta-3 focus:caret-meta-3"
                        type="text"
                        id="title"
                        value={title}
                        placeholder="Festival 17 Agustus"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full mb-2">
                    <label className="mb-2 font-medium" htmlFor="body">
                        Isi
                    </label>
                    <ReactQuill
                        className="border-2 border-slate-400 rounded-md focus:outline-meta-3 focus:caret-meta-3"
                        theme="snow"
                        value={body}
                        id="body"
                        onChange={setBody}
                    />
                </div>
                <div className="flex flex-col w-full mb-2">
                    <label className="mb-2 font-medium" htmlFor="tag">
                        Tag
                    </label>
                    <input
                        className="px-3 py-2 mb-2 border-2 border-slate-400 rounded-md focus:outline-meta-3 focus:caret-meta-3"
                        type="text"
                        id="tag"
                        value={tag}
                        placeholder="Berita Desa"
                        onChange={(e) => setTag(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full mb-2">
                    <label className="mb-2 font-medium" htmlFor="thumbnail">
                        Thumbnail
                    </label>
                    <input
                        className="px-3 py-2 mb-2 border-2 border-slate-400 rounded-md focus:outline-meta-3 focus:caret-meta-3 file:bg-white file:border-meta-3 file:rounded file:text-sm"
                        type="file"
                        id="thumbnail"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                </div>
                <div className="flex flex-col w-full mb-2">
                    <button className="px-3 py-2 mb-2 bg-meta-3 uppercase font-medium text-white rounded hover:bg-emerald-600">
                        Simpan
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EditArtikel;
