# server/trips/consumers.py

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class TaxiConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for handling taxi-related real-time communications.
    
    This consumer manages WebSocket connections for the taxi application,
    handling authentication, group management, and message processing.
    
    Attributes:
        groups: List of group names this consumer belongs to.
        variable: A test variable for demonstration purposes.
    """
    groups = ['test']

    variable = 'test'

    async def connect(self):
        """Handle WebSocket connection.
        
        Authenticates the user and adds them to the 'test' group if authenticated.
        Closes the connection for anonymous users.
        
        Returns:
            None
        """
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            await self.channel_layer.group_add(
                group='test',
                channel=self.channel_name
            )
            await self.accept()

    async def disconnect(self, code):
        """
        Handle WebSocket disconnection.
        
        Args:
            code: The close code indicating the reason for disconnection.
            
        Returns:
            None
        """
        await super().disconnect(code)

    async def echo_message(self, message):
        """
        Echo a message back to the client.
        
        Args:
            message: The message to echo, containing 'type' and 'data' fields.
            
        Returns:
            None
        """
        await self.send_json({
            'type': message.get('type'),
            'data': message.get('data'),
        })

    async def receive_json(self, content, **kwargs):
        """
        Process incoming JSON messages from the client.
        
        Currently handles 'echo.message' type messages by sending them back to the client.
        Other message types are ignored.
        
        Args:
            content: The JSON content received from the client.
            **kwargs: Additional keyword arguments.
            
        Returns:
            None
        """
        message_type = content.get('type')
        if message_type == 'echo.message':
            await self.send_json({
                'type': message_type,
                'data': content.get('data'),
            })
