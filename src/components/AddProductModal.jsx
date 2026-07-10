import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Plus, Upload } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose }) {
  const { addProduct, activeCategory, categories } = useContext(AppContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [materials, setMaterials] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectableCategories = categories || [];

  // Reset inputs when modal opens/closes
  useEffect(() => {
    setName('');
    setPrice('');
    setMaterials('');
    setImageFile(null);
    setImagePreview('');
    setError('');
    setIsSubmitting(false);
    setCategory(activeCategory);
  }, [isOpen, activeCategory]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file is too large! Limit is 5MB.');
        return;
      }

      setError('');
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a product name.');
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      setError('Please enter a valid price in rupees.');
      return;
    }
    if (!imageFile) {
      setError('Please select or upload a product photo.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare multipart FormData
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', Math.round(Number(price)));
      formData.append('materials', materials.trim());
      formData.append('category', category);
      formData.append('image', imageFile); // raw file object
      formData.append(
        'description',
        `A custom-designed, premium finish product in our ${category} category. Hand-machined and installed by SELVA HARISH workshops.`
      );

      const result = await addProduct(formData);
      
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Server error occurred while adding product card');
      }
    } catch (err) {
      setError('A network failure occurred. Please make sure the backend is active.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content add-product-modal-content">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <div className="add-product-header">
          <Plus size={22} className="add-icon-accent" />
          <h3>Add New Product</h3>
        </div>
        <p className="add-product-subtitle">
          Adding item to category: <strong>{category}</strong>
        </p>

        {error && <div className="add-product-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label htmlFor="prod-category">Product Category</label>
            <select
              id="prod-category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
              style={{ cursor: 'pointer', appearance: 'auto' }}
            >
              {selectableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="prod-name">Product Name / Design Model</label>
            <input
              id="prod-name"
              type="text"
              className="form-control"
              placeholder="e.g. Elegant Teak Wardrobe, Laser CNC Door"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-price">Estimated Price (in ₹ Rupees)</label>
            <input
              id="prod-price"
              type="number"
              className="form-control"
              placeholder="e.g. 45000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-materials">Materials Used (Comma-separated)</label>
            <input
              id="prod-materials"
              type="text"
              className="form-control"
              placeholder="e.g. Seasoned Burma Teak, Melamine Polish, Brass Hinges"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Product Photograph</label>
            <div className="image-upload-wrapper">
              {imagePreview ? (
                <div className="image-upload-preview-container">
                  <img src={imagePreview} alt="Selected preview" className="upload-preview-img" />
                  <button
                    type="button"
                    className="remove-preview-btn"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    disabled={isSubmitting}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="file-upload-dropzone">
                  <Upload size={32} className="upload-arrow-icon" />
                  <span>Choose product photo from gallery</span>
                  <span className="file-limit-text">PNG, JPG, JPEG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden-file-input"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block add-submit-btn"
            disabled={isSubmitting}
          >
            <Plus size={16} />
            <span>{isSubmitting ? 'Uploading to Server...' : 'Create Product Card'}</span>
          </button>
        </form>
      </div>

      <style>{`
        .add-product-modal-content {
          max-width: 480px;
          text-align: left;
        }

        .add-product-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .add-icon-accent {
          color: var(--primary);
        }

        .add-product-header h3 {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .add-product-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 10px;
        }

        .add-product-error-alert {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 20px;
        }

        /* Image upload area */
        .image-upload-wrapper {
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-input);
          text-align: center;
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        .image-upload-wrapper:hover {
          border-color: var(--primary);
        }

        .file-upload-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
          gap: 8px;
        }

        .upload-arrow-icon {
          color: var(--text-muted);
        }

        .file-limit-text {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .hidden-file-input {
          display: none;
        }

        .image-upload-preview-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-preview-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }

        .remove-preview-btn {
          font-size: 0.82rem;
          color: #dc2626;
          font-weight: 500;
          text-decoration: underline;
        }

        .add-submit-btn {
          width: 100%;
          padding: 12px;
          font-weight: 600;
          margin-top: 12px;
        }
        .add-submit-btn:disabled {
          background-color: var(--text-muted);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
