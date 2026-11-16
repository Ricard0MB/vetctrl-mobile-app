import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  time: Date;
  options?: { id: any; texto: string }[]; // 'any' para aceptar ID numérico o de menú
  pending?: any;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  // 👇 MENÚ INICIAL AGREGADO AQUÍ
  messages: ChatMessage[] = [
    {
      text: '¡Hola! Soy VetBot 🤖. ¿En qué te puedo ayudar hoy?',
      isUser: false,
      time: new Date(),
      options: [
        { id: 'menu_consulta', texto: '🩺 Consulta médica' },
        { id: 'menu_registrar', texto: '📝 Registrar paciente' },
        { id: 'menu_editar', texto: '✏️ Editar paciente' },
        { id: 'menu_cita', texto: '📅 Agendar cita' }
      ]
    }
  ];
  newMessage: string = '';
  isBotTyping: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  sendMessage(directText?: string, optionId?: any, pending?: any) {
    const userText = (directText ?? this.newMessage).trim();
    if (!userText) return;

    // 1. Pintar mensaje del usuario
    this.messages.push({ text: userText, isUser: true, time: new Date() });
    this.newMessage = '';
    this.isBotTyping = true;
    this.scrollToBottom();

    // 2. Construir payload
    const payload: any = { message: userText };
    
    // Si es una opción de la BD (número), la mandamos al backend
    if (typeof optionId === 'number') {
      payload.optionId = optionId;
    }
    if (pending !== undefined) {
      payload.pendingAction = pending;
    }

    // 3. Llamar al backend
    this.http.post(`${this.apiBaseUrl}?resource=chatbot`, payload, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        this.isBotTyping = false;
        if (res.success && res.data && res.data.reply) {
          this.handleBotReply(res.data.reply);
        } else {
          this.messages.push({ text: 'No recibí respuesta del servidor. 😔', isUser: false, time: new Date() });
        }
        this.scrollToBottom();
      },
      error: (err: any) => {
        this.isBotTyping = false;
        console.error('Error del bot:', err);
        this.messages.push({ text: 'Error de conexión con el servidor. 😔', isUser: false, time: new Date() });
        this.scrollToBottom();
      }
    });
  }

  private handleBotReply(reply: any) {
    if (typeof reply === 'string') {
      this.messages.push({ text: reply, isUser: false, time: new Date() });
      return;
    }

    if (reply.tipo === 'opciones' && Array.isArray(reply.opciones)) {
      this.messages.push({
        text: reply.pregunta || '¿A cuál te refieres?',
        isUser: false,
        time: new Date(),
        options: reply.opciones,
        pending: reply.pending ?? null
      });
      return;
    }

    this.messages.push({
      text: reply.texto || 'No entendí tu solicitud.',
      isUser: false,
      time: new Date()
    });
  }

  onOptionClick(msg: ChatMessage, opt: { id: any; texto: string }) {
    if (!msg.options) return;

    // Limpiar opciones para que no se pueda tocar dos veces
    msg.options = undefined;

    // Si es una opción del menú inicial (texto), solo enviamos el texto
    if (typeof opt.id === 'string' && opt.id.startsWith('menu_')) {
      this.sendMessage(opt.texto);
    } else {
      // Si es una opción de mascota (ID numérico), enviamos el ID y el pending
      this.sendMessage(opt.texto, opt.id, msg.pending);
      msg.pending = undefined;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}