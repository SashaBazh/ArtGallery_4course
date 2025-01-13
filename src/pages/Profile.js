import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { fetchUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    birthday: '',
    image_url: '',
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
        const userProfile = response.data;

        const formattedBirthday = userProfile.birthday
          ? userProfile.birthday.split('T')[0]
          : '';

        setProfile({
          ...userProfile,
          birthday: formattedBirthday,
        });
        setOriginalProfile({
          ...userProfile,
          birthday: formattedBirthday,
        });
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    let timer;
    if (message || error) {
      timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
    return () => clearTimeout(timer); // Очищаем таймер при размонтировании компонента
  }, [message, error]);

  const handleEditToggle = () => {
    setIsEditing(true);
    setMessage(null);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfile(originalProfile);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      profile.name === originalProfile.name &&
      profile.birthday === originalProfile.birthday
    ) {
      setMessage('Нет изменений для сохранения.');
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.put('/user/profile', {
        name: profile.name,
        birthday: profile.birthday || null,
      });
      const updatedProfile = response.data;
      setProfile({
        ...updatedProfile,
        birthday: updatedProfile.birthday
          ? updatedProfile.birthday.split('T')[0]
          : '',
      });
      setOriginalProfile({
        ...updatedProfile,
        birthday: updatedProfile.birthday
          ? updatedProfile.birthday.split('T')[0]
          : '',
      });

      setMessage('Профиль успешно обновлен.');
      setIsEditing(false);

      if (fetchUserProfile) {
        fetchUserProfile();
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось обновить профиль. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSave}>
        <h2 className="form-title">Профиль пользователя</h2>
        {message && <p className="form-message success">{message}</p>}
        {error && <p className="form-message error">{error}</p>}

        {isLoading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={profile.email} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="birthday">Дата рождения</label>
              <input
                type="date"
                id="birthday"
                value={profile.birthday || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
              />
            </div>
            {profile.image_url && (
              <div className="form-avatar">
                <img src={profile.image_url} alt="Аватар" className="avatar-image" />
              </div>
            )}
            {isEditing ? (
              <div className="form-buttons">
                <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                  Отмена
                </button>
                <button type="submit" className="save-btn">
                  Сохранить
                </button>
              </div>
            ) : (
              <button type="button" onClick={handleEditToggle} className="edit-btn">
                Редактировать
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default Profile;
