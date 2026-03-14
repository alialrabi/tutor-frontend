import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { VideoService } from '../../core/services/video.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-stream-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-stream-component.component.html',
  styleUrls: ['./video-stream-component.component.css']
})
export class VideoStreamComponentComponent implements OnInit, OnDestroy {
  @ViewChild('callFrame', { static: true }) callFrame!: ElementRef;

  callObject: DailyCall | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    debugger
    this.route.params.subscribe(params => {
      debugger
      const sessionId = params['id'];
      if (sessionId) {
        this.videoService.createRoom(sessionId).subscribe({
          next: (response: any) => {
            this.startCall(response?.data);
          },
          error: (err) => {
            this.error = 'Failed to create video room.';
            this.loading = false;
            console.error(err);
          }
        });
      } else {
        this.error = 'No session ID provided.';
        this.loading = false;
      }
    });
  }

  startCall(roomUrl: string): void {
    this.callObject = DailyIframe.createFrame(this.callFrame.nativeElement, {
      showLeaveButton: true,
      iframeStyle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '0',
      },
    });


    this.callObject.join({ url: roomUrl })
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        this.error = `Failed to join call: ${err.message}`;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.callObject?.destroy();
  }
}
