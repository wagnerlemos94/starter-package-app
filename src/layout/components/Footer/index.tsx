import { theme } from '@/layout/globalStyles/theme';
import React from 'react';
import { appConfig } from '@/config/appConfig';

const Footer: React.FC = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '1rem 1.5rem',
      background: 'transparent',
      borderTop: '1px solid #E5E7EB',
      textAlign: 'center',
      fontSize: '0.8rem',
      color: theme.color.info,
      marginTop: 'auto',
    }}>
      © {new Date().getFullYear()} {appConfig.nomeSistema}. Todos os direitos reservados.
    </footer>
  );
};

export default Footer;
