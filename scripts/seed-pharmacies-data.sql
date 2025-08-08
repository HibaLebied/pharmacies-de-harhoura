-- Insérer des données d'exemple avec plusieurs plages horaires
INSERT INTO pharmacies (name, address, phone, opening_hours, latitude, longitude, image_url) VALUES
('Pharmacie Centrale Harhoura', 'Avenue Mohammed V, Centre Harhoura', '+212537123456', 
  '{
    "lun": [{"open": "08:00", "close": "12:00"}, {"open": "14:00", "close": "20:00"}],
    "mar": [{"open": "08:00", "close": "12:00"}, {"open": "14:00", "close": "20:00"}],
    "mer": [{"open": "08:00", "close": "12:00"}, {"open": "14:00", "close": "20:00"}],
    "jeu": [{"open": "08:00", "close": "20:00"}],
    "ven": [{"open": "08:00", "close": "12:30"}, {"open": "14:00", "close": "19:00"}],
    "sam": [{"open": "09:00", "close": "13:00"}, {"open": "15:00", "close": "18:00"}],
    "dim": []
  }', 33.9716, -6.8498, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop'),

('Pharmacie Al Amal', 'Rue des Palmiers, Quartier Résidentiel', '+212537789012', 
  '{
    "lun": [{"open": "09:00", "close": "19:00"}],
    "mar": [{"open": "09:00", "close": "12:30"}, {"open": "14:00", "close": "19:00"}],
    "mer": [{"open": "09:00", "close": "12:30"}, {"open": "15:00", "close": "19:30"}],
    "jeu": [{"open": "09:00", "close": "19:00"}],
    "ven": [{"open": "09:00", "close": "12:00"}, {"open": "14:30", "close": "19:00"}],
    "sam": [{"open": "10:00", "close": "17:00"}],
    "dim": []
  }', 33.9720, -6.8505, 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop'),

('Pharmacie du Port', 'Port de Plaisance Harhoura', '+212537345678', 
  '{
    "lun": [{"open": "08:30", "close": "19:30"}],
    "mar": [{"open": "08:30", "close": "12:30"}, {"open": "14:00", "close": "19:30"}],
    "mer": [{"open": "08:30", "close": "19:30"}],
    "jeu": [{"open": "08:30", "close": "19:30"}],
    "ven": [{"open": "08:30", "close": "19:30"}],
    "sam": [{"open": "09:00", "close": "18:00"}],
    "dim": [{"open": "10:00", "close": "16:00"}]
  }', 33.9710, -6.8490, 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=300&h=200&fit=crop'),

('Pharmacie Atlas', 'Boulevard Atlas, Harhoura', '+212537456789', 
  '{
    "lun": [{"open": "08:00", "close": "21:00"}],
    "mar": [{"open": "08:00", "close": "21:00"}],
    "mer": [{"open": "08:00", "close": "21:00"}],
    "jeu": [{"open": "08:00", "close": "21:00"}],
    "ven": [{"open": "08:00", "close": "12:30"}, {"open": "14:00", "close": "21:00"}],
    "sam": [{"open": "09:00", "close": "19:00"}],
    "dim": [{"open": "09:00", "close": "17:00"}]
  }', 33.9725, -6.8485, 'https://images.unsplash.com/photo-1585435557343-3b092031d8eb?w=300&h=200&fit=crop'),

('Pharmacie de la Plage', 'Avenue de la Corniche', '+212537567890', 
  '{
    "lun": [{"open": "09:00", "close": "20:00"}],
    "mar": [{"open": "09:00", "close": "20:00"}],
    "mer": [{"open": "09:00", "close": "12:30"}, {"open": "14:30", "close": "20:00"}],
    "jeu": [{"open": "09:00", "close": "20:00"}],
    "ven": [{"open": "09:00", "close": "20:00"}],
    "sam": [{"open": "10:00", "close": "18:00"}],
    "dim": []
  }', 33.9700, -6.8520, 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop'),

('Pharmacie Moderne', 'Centre Commercial Harhoura', '+212537678901', 
  '{
    "lun": [{"open": "10:00", "close": "22:00"}],
    "mar": [{"open": "10:00", "close": "22:00"}],
    "mer": [{"open": "10:00", "close": "22:00"}],
    "jeu": [{"open": "10:00", "close": "22:00"}],
    "ven": [{"open": "10:00", "close": "22:00"}],
    "sam": [{"open": "10:00", "close": "22:00"}],
    "dim": [{"open": "10:00", "close": "20:00"}]
  }', 33.9730, -6.8475, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop');
