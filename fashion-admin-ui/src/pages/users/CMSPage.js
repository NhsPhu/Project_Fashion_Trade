// src/pages/users/CMSPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { apiClient } from '../../services/AuthService';  // Giữ nguyên để gọi API

const CMSPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/api/v1/pages/${slug}`);
                setPageData(response.data);
            } catch (err) {
                console.error('Không tìm thấy trang CMS:', err);
                setPageData(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!pageData) {
        return (
            <Result
                status="404"
                title="404 - Không tìm thấy"
                subTitle="Trang bạn đang tìm không tồn tại hoặc chưa được công khai."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>
                }
            />
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '30px' }}>
                {pageData.title}
            </h1>
            <div
                className="cms-content"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
                style={{ lineHeight: '1.8', fontSize: '16px' }}
            />
        </div>
    );
};

export default CMSPage;