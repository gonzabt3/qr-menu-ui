import React from 'react';
import BaseCompents from '../components/BaseCompents';
import { Box, Heading, Text } from '@chakra-ui/react';

const Terms = () => {
  return (
    <BaseCompents>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
        padding={5}
      >
        <Heading as="h1" size="lg" mb={4}>
          Términos y Condiciones
        </Heading>
        <Text fontSize="md" mb={2}>
          TÉRMINOS Y CONDICIONES DE USO DE MENUQR.AI

          Fecha de última actualización: 30 de marzo de 2025

          Bienvenido a MenuQR.ai, una plataforma que permite a los usuarios crear y gestionar menús QR personalizados. Al acceder y utilizar nuestra aplicación, aceptas cumplir con los términos y condiciones establecidos en este documento. Si no estás de acuerdo con estos términos, por favor no utilices la aplicación.

          "Usuario" se refiere a la persona que utiliza la aplicación MenuQR.ai para crear o acceder a menús QR. "Creador del Menú" es el usuario que crea y gestiona un menú QR en la plataforma. "Aplicación" se refiere a la aplicación MenuQR.ai y sus servicios asociados.

          MenuQR.ai permite a los creadores de menús generar y gestionar menús en formato QR, los cuales pueden ser escaneados por otros usuarios para visualizar el contenido. Los creadores tienen la capacidad de actualizar, modificar y gestionar el contenido de su menú QR de manera autónoma.

          Para utilizar los servicios de MenuQR.ai, los usuarios deben tener acceso a un dispositivo compatible con la aplicación (como un teléfono móvil o una tableta), ser mayores de edad o contar con el consentimiento de un tutor legal, y disponer de una conexión a Internet estable.

          Para crear y gestionar un menú QR, los usuarios deberán registrarse en la aplicación proporcionando información personal precisa y completa. El registro puede incluir nombre, dirección de correo electrónico y otros datos solicitados. El usuario se compromete a mantener la confidencialidad de su cuenta y a notificar inmediatamente cualquier uso no autorizado de su cuenta.

          Los creadores del menú son responsables de todo el contenido que suban a la plataforma, incluyendo texto, imágenes y otros medios. El contenido debe ser apropiado y no violar derechos de terceros. Está prohibido el uso de la plataforma para fines ilegales o no autorizados, como la distribución de contenido difamatorio, obsceno o que infrinja derechos de propiedad intelectual.

          Todos los derechos sobre la tecnología y el diseño de MenuQR.ai son propiedad de [Nombre de la empresa o titular]. Los usuarios no tienen derecho a copiar, modificar, distribuir o crear obras derivadas de la aplicación sin el consentimiento expreso de MenuQR.ai. Los menús QR creados por los usuarios seguirán siendo propiedad de los creadores, pero MenuQR.ai se reserva el derecho de utilizarlos para fines promocionales o de mejora del servicio.

          MenuQR.ai se compromete a proteger la privacidad de sus usuarios y a cumplir con la Ley 25.326 de Protección de Datos Personales de Argentina. Para obtener más detalles sobre cómo tratamos la información personal, consulta nuestra [Política de Privacidad].

          MenuQR.ai no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso de la aplicación. Tampoco garantiza la disponibilidad ininterrumpida del servicio y se reserva el derecho de suspender o interrumpir el acceso a la plataforma por mantenimiento o mejoras.

          MenuQR.ai se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Cualquier cambio será publicado en esta página, y se notificará a los usuarios registrados. El uso continuado de la aplicación implica la aceptación de dichos cambios.

          Estos términos se rigen por las leyes de la República Argentina. En caso de controversias, los usuarios se someten a la jurisdicción de los tribunales competentes de [Ciudad], Argentina.

          Para cualquier duda o consulta sobre estos términos y condiciones, puedes ponerte en contacto con nosotros a través de nuestro correo electrónico: info@qrmenu.ai.
        </Text>
      </Box>
    </BaseCompents>
  );
};

export default Terms;